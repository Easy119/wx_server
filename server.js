const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser()) 
const config = require("./config/config")
const Wechat = require("./wechat/g")
const weixin = require("./wechat/weixin")
app.use(Wechat(config.wechat,weixin.replay)) // 配置 服务器信息
// ++++++++++++
const Router = require("koa-router");
const router = new Router();
const newsTpl = require("./api/newsTpl");
const path = require("path");
const accessToken_Path = path.join(__dirname,"./config/accessToken.txt");
const util = require("./libs/util")
const get_Ticket = require("./api/ticket")
const crypto = require("crypto");
router.get("/",async function(ctx){
    let code = ctx.query.code;
    // 获取accesstion 
    let result = await newsTpl.getOpenId(code);
    let openid = JSON.parse(result).openid;
    let newsTplResult = await newsTpl.newsTpl(openid);
})
function _sign (noncestr,timestamp,jsapi_ticket,url){
    let signArray = [`noncestr=${noncestr}`,`jsapi_ticket=${jsapi_ticket}`,`timestamp=${timestamp}`,`url=${url}`];
    let signString = signArray.sort().join("&");
    let shasum = crypto.createHash("sha1");
    shasum.update(signString)
    return shasum.digest("hex")
}
router.get("/index",async function(ctx){
    let accessToken = await util.readFileAsync(accessToken_Path);
    console.log(JSON.parse(accessToken).access_token)
    let ticketJson = await get_Ticket(JSON.parse(accessToken).access_token);
    console.log(`ticketJson:${ticketJson}`);
    let ticketString = JSON.parse(ticketJson).ticket;
    let timestamp = parseInt(new Date().getTime()/1000,10) +"";
    let noncestr = Math.random().toString(36).substr(2,15);
    let signature = _sign(noncestr,timestamp,ticketString,ctx.url);
    console.log(config.wechat.appID,noncestr,timestamp,ticketString);
    ctx.body = {"flag":true,"msg":{appID:config.wechat.appID,noncestr,timestamp,ticketString,noncestr,timestamp,ticketString}}
})
app.use(router.routes())
app.listen("8030",function(){
    console.log("run port 8030")
})
// 箭头 函数 this的指向问题