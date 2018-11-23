const request = require("request")
const path = require("path")
const wechat_file = path.join(__dirname, "../config/accessToken.txt");
const util = require("../libs/util")
const config = require("../config/config")
let getOpenId = async (code) => {
    const appid = config.wechat.appID;
    const secret = config.wechat.appsecret;
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    return new Promise((resove, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const openid = body.openid;
                console.log(body)
                resove(body); //获取openid成功后调用getAccessToken
            }else{
                reject(error)
            }
        });
    })
}
let newsTpl = async (openid) => {
    let result = await util.readFileAsync(wechat_file);
    let ACCESS_TOKEN = JSON.parse(result).access_token;
    let newDataJson = {
        "touser": openid,
        "template_id": "npMLWzWP5kuTL82PAQH3sP_osVv2joKSUFNPuJrPsDA",
        "url": "http://weixin.qq.com/download",
        "topcolor": "#FF0000",
        "data": {
            "first": "first",
            "keyword1": {

                "value":"大度床头柜",

                "color":"#173177"

            },
            "keyword2": {

                "value":"8052176932818",

                "color":"#173177"

            },
            "keyword3": {

                "value":"1999",

                "color":"#ff6600"

            },
            "keyword4": {

                "value":"06月07日 19时24分",

                "color":"#173177"

            },
            "remark": "remark"
        }
    };
    return new Promise((resove, reject) => {
        request({url:`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, body:JSON.stringify(newDataJson),method:"POST"}, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body)
                resove(body)
            } else {
                console.log(error)
            }
        })
    })
}
module.exports = {
    newsTpl,getOpenId
}