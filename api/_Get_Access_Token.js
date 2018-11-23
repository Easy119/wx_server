let request = require("request");
let fs = require("fs");
let path = require("path");
const wechat_file = path.join(__dirname, "../config/accessToken.txt");
const config_str = require("../config/config").wechat
let xml2js = require('xml2js'); // 用于解析 xml 数据
var xmlParser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true
})

// 异步 写入文件
let writeFileAsync = (f_path, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(f_path, content, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}
// 获取新的access_token  值
let getNewAccessToken = () => {
    let requestUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config_str.appID}&secret=${config_str.appsecret}`;
    request.get(requestUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let newTiems = new Date().getTime();
            body = JSON.parse(body);
            let get_expires_in = body.expires_in;
            body.expires_in = newTiems + (get_expires_in * 1000);
            let accessTokenString = JSON.stringify(body);
            writeFileAsync(wechat_file, accessTokenString)
        }
    })
}
//  更新过期的access_token 值
let updateAccessToken = (opts) => {
    let requestUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${opts.appID}&secret=${opts.appsecret}`;
    request.get(requestUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let newTiems = new Date().getTime();
            body = JSON.parse(body);
            let get_expires_in = body.expires_in;
            body.expires_in = newTiems + (get_expires_in - 20) * 1000; // 让时间戳 提前20s 失效
            let accessTokenString = JSON.stringify(body);
            console.log(accessTokenString)
            writeFileAsync(wechat_file, accessTokenString)
        }
    })
}
// 判断 access_token 是否过期
let is_vaile_access = (opts) => {
    let newTiems = new Date().getTime(); // 当前的时间戳
    let accessToken = JSON.parse(opts);
    if (accessToken.expires_in > newTiems) { // 时间戳有效 
        return true
    } else { // 时间戳失效
        return false
    }
}
// 异步读取 access_token 文件
let readFileAsync = (rs_path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(rs_path, {
            encoding: "utf-8"
        }, (err, content) => {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}
let get_old_access_token = async (ctx,next) => {
    // 读取文件 是否存在 access_token
    let readFileResult = await readFileAsync(wechat_file);
    if (readFileResult) { // 如果 readFileResult 存在
        // access_token  是否过期
        if (!is_vaile_access(readFileResult)) { // access_token 过期
            // access_token 过期 就要跟新token
            console.log("过期")
            updateAccessToken(config_str)
        } else { // access_token 没有过期
            console.log("有效")
            return readFileResult
        }
    } else { // 读取文件为空 代表没有token 就要直接执行获取assess_token 
        getNewAccessToken()
    }
}
module.exports = get_old_access_token;
//  重点看看 commonjs  module.exports