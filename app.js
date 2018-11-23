const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser()) 
const config = require("./config/config")
const Router = require("koa-router");
const urlencode = require("urlencode")
const router = new Router()
router.get('/authentication', function(ctx) {
    const appid = config.wechat.appID;
    const redirect_uri = urlencode("http://23b50f58.ngrok.io"); //这里的url需要转为加密格式，它的作用是访问微信网页鉴权接口成功后微信会回调这个地址，并把code参数带在回调地址中
    const scope = 'snsapi_userinfo';
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE&connect_redirect=1#wechat_redirect`;

    const html =
    `<!DOCTYPE html>
    <html>
        <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>微信鉴权引导</title>
        </head>
        <body><a href="${url}">跳转到鉴权页面</a></body>
    </html>`;
    ctx.body = html ;
});
router.get("/code",async (ctx)=>{
    let code = ctx.query.code;
    ctx.body = ctx.query
})
app.use(router.routes()).use(router.allowedMethods())
app.listen("8040",function(){
    console.log("run port 8040")
})
// 箭头 函数 this的指向问题