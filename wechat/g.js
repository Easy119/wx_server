const sha1 = require("sha1");
let getRowBody = require("raw-body")
const Wechat = require("./wechat")
const util = require("../libs/util")
module.exports = function (opts,handler) {
    let wechat = new Wechat(opts,handler)
    return async function(ctx, next){
        let configStr = ctx.request.query;
        let token = opts.token;
        let signature = configStr.signature;
        let nonce = configStr.nonce;
        let timestamp = configStr.timestamp;
        let echostr = configStr.echostr;
        let str = [token, timestamp, nonce].sort().join(""); // token 时间戳  和 随机数 进行 字符串的拼接
        // sha1 的加密验证 得到一个 签名字符串 
        let signature_Str = sha1(str);
        // 验证请求方式 ctx.request.method
        if (ctx.request.method === "GET") {
            if (signature_Str === signature) {
                ctx.body = echostr + "";
            } else {
              await next()
            }
        } else if (ctx.request.method === "POST") {
            if (signature_Str !== signature) {
                ctx.body = "wrong";
            }
           let result = await getRowBody(ctx.req, { // ctx.req
                limit: "1mb",
                length: this.length,
                encoding: this.charset
            })
            let xml = await util.parseXmlAysnc(result);
            let message = util.formatMessage(xml.xml);
            ctx.weixin = message;
            await handler.call(ctx,next)
            wechat.replay.call(ctx);
        }
    }
}