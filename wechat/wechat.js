const request = require("request")
const util = require("../libs/util")
const fs = require("fs")
const wechatApiBaseUrl = {
    wx_createMenuApi: {
        create: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=",
        delete: "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=",
        get: "https://api.weixin.qq.com/cgi-bin/menu/get?access_token="
    },
    wx_createTagApi: {
        createTag: "https://api.weixin.qq.com/cgi-bin/tags/create?access_token=",
        deleteTag: "https://api.weixin.qq.com/cgi-bin/tags/delete?access_token=",
        getTag: "https://api.weixin.qq.com/cgi-bin/tags/get?access_token=",
        getFansTags: "https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=", //. 获取用户身上的标签列表
        batchGroup: "https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=" // 批量为用户打标签
    },
    wx_userInfo: {
        getOneInfo: "https://api.weixin.qq.com/cgi-bin/user/info?access_token=", // 获取一条用户信息
        postListInfo: "https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=ACCESS_TOKEN" // 批量获取 用户信息
    }
}

function Wechat(opts) {
    let that = this;
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getAccessToken().then(async function (data) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            return that.updatedAccessToken(data)
        }
        let isVal = await that.isValidAccessToken(data);
        if (!isVal) {
            console.log("更新？");
            let result = await that.updatedAccessToken()
            return Promise.resolve(result)
        } else {
            return Promise.resolve(data)
        }
    }).then(function (data) {
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(data);
    }).catch(function () {
        throw new Error('getAccessToken exception!');
    }).catch(function () {
        throw new Error('getAccessToken exception!');
    })
}
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data["expires_in"] || !data["access_token"]) {
        return false
    }
    var get_expires_in = data["expires_in"];
    let now = (new Date().getTime());
    if (now < get_expires_in) {
        return true
    } else {
        return false
    }
}
Wechat.prototype.updatedAccessToken = function () {
    let appID = this.appID;
    let appsecret = this.appsecret;
    let requestUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve) => {
        request.get(requestUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let newTiems = new Date().getTime();
                body = JSON.parse(body);
                let get_expires_in = body.expires_in;
                body.expires_in = newTiems + (get_expires_in - 20) * 1000; // 让时间戳 提前20s 失效
                resolve(body)
            }
        })
    })
}

Wechat.prototype.fetchAccessToken = function () {
    let that = this;
    return new Promise(function (resolve) {
        that.getAccessToken().then(function (data) {
            data = JSON.parse(data)
            if (!that.isValidAccessToken(data)) {
                return that.updatedAccessToken(data)
            } else {
                return Promise.resolve(data)
            }
        }).then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
            resolve(data)
        })
    })
}
Wechat.prototype.uploadMeteril = async function (type, fs_path) {
    let from = {
        media: fs.createReadStream(fs_path)
    }
    let data = await this.fetchAccessToken();
    let url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${data.access_token}&type=${type}`;
    return new Promise((resolve, reject) => {
        request.post(url, {
            formData: from
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}
// 菜单的 创建 和 获取
Wechat.prototype.createMenu = async function (menuJson) {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        request({
            url: wechatApiBaseUrl.wx_createMenuApi.create + data.access_token,
            body: menuJson,
            json: true,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.getMenu = async function () {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        request.get(wechatApiBaseUrl.wx_createMenuApi.delete + data.access_token, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.deleteMenu = async function () {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        request.get(wechatApiBaseUrl.wx_createMenuApi.delete + data.access_token, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
// 用户的分组
Wechat.prototype.createGroup = async function (opts) {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        let options = {
            "tag": {
                "name": opts //标签名 
            }
        };
        request({
            url: wechatApiBaseUrl.wx_createTagApi.createTag + data.access_token,
            body: options,
            json: true,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.getGroup = async function () {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        request({
            url: wechatApiBaseUrl.wx_createTagApi.getTag + data.access_token,
            json: true,
            method: "GET"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.checkGroup = async function (opts) { // 获取用户身上的标签列表
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        let options = {
            "openid": opts
        };
        request({
            url: wechatApiBaseUrl.wx_createTagApi.getFansTags + data.access_token,
            body: options,
            json: true,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.batchGroup = async function (openid_list, tagid) { //批量为用户打标签
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        let options = {
            "openid_list": openid_list,
            "tagid": tagid
        };
        request({
            url: wechatApiBaseUrl.wx_createTagApi.batchGroup + data.access_token,
            body: options,
            json: true,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.deleteTag = async function (opts) {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        let options = {
            "tag": {
                "id": opts //标签名 
            }
        };
        request({
            url: wechatApiBaseUrl.wx_createTagApi.deleteTag + data.access_token,
            json: true,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
//  获取用户基本信息
Wechat.prototype.getOneUserInfo = async function (opts) {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        request({
            url: `${wechatApiBaseUrl.wx_userInfo.getOneInfo}${data.access_token}&openid=${opts}&lang=zh_CN`,
            json: true,
            method: "GET"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.getUserListInfo = async function (opts) {
    let data = await this.fetchAccessToken();
    return new Promise(function (reslove, reject) {
        let options = {
            "user_list":opts
        }
        request({
            url: wechatApiBaseUrl.wx_userInfo.postListInfo + data.access_token ,
            json: true,
            body:options,
            method: "POST"
        }, function (error, response, result) {
            if (!error && response.statusCode == 200) {
                reslove(result)
            } else {
                reject(error)
            }
        })
    })
}
Wechat.prototype.replay = function () {
    let message = this.weixin;
    let xml = util.tpl(message);
    this.status = 200;
    this.type = "application/xml";
    this.body = xml;
}
module.exports = Wechat
/*
1.JSON 对象的写法 和 对象的写法的差别


*/ 