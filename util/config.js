const config = require("../config/config")
const sha1 = require("sha1");
module.exports = function (opts) {
    return async (ctx,next) => {
        let configStr = ctx.request.query;
        let token = opts.wechat.token;
        let signature = configStr.signature;
        let nonce = configStr.nonce;
        let timestamp = configStr.timestamp;
        let echostr = configStr.echostr;
        let str = [token, timestamp, nonce].sort().join(""); // token 时间戳  和 随机数 进行 字符串的拼接
        // sha1 的加密验证 得到一个 签名字符串 
        let signature_Str = sha1(str);
        if (signature_Str === signature) {
            ctx.body = echostr + "";
        } else {
            ctx.body = "wrong";
        }
        await next()
    }
}