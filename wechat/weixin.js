const WeChat = require("./wechat")
const config = require("../config/config")
const menuJson = require("../config/menu")
let wechatApi = new WeChat(config.wechat);
wechatApi.deleteMenu().then(function(){
    return wechatApi.createMenu(menuJson)
}).then(function(msg){
    console.log(msg)
})
const path = require("path");
let replay = async function (next) {
    let message = this.weixin;
    console.log(message);
    if (message.MsgType === "event") {
        if (message.Event === "subscribe") {
            if (message.EventKey) {
                console.log(`扫二维码进来：${message.EventKey} ${message.ticket}`)
            }
            let replay = [{
                title: "重磅新品 | 你们千呼万唤的万能梳妆台与百变小酒柜来啦！",
                description: "生活可以更懂你",
                picUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/1QYl6yZHptEsmpm6PJzmRwTYJZYLxwho1AdCggdKGmIfRMGplMoN0mL2T3iaia4ic4CLqjZtamNoWXkwpj69E941g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                url: "https://mp.weixin.qq.com/s/tOUrIrgCrKB87i-WiCtQRw"
            }]
            this.weixin.MsgType = "news"
            this.weixin.Content = replay
        } else if (message.Event === "unsubscribe") {
            console.log("狠心取关");
            this.body = `呜呜，你狠心取消订阅了这个号,消息ID：${message.MsgId}`
        } else if (message.Event === "LOCATION") {
            console.log(`您上报的位置：地理位置纬度:${message.Latitude};位置:${message.Longitude}`)
            this.body = `您上报的位置：地理位置纬度:${message.Latitude};位置:${message.Longitude}`;
        } else if (message.Event === "CLICK") {
            console.log(`您点击了菜单：${message.EventKey}`)
            this.body = `您点击了菜单：${message.EventKey}`
        } else if (message.Event === "SCAN") {
            console.log(`关注后扫码二维码：${message.EventKey}`)
            this.body = `关注后扫码二维码：${message.EventKey}`
        } else if (message.Event === "VIEW") {
            console.log(`点击了菜单链接：${message.EventKey}`)
            this.body = `点击了菜单链接：${message.EventKey}`
        } else if (message.Event === "scancode_push") {
            console.log(`扫码推事件用户点击按钮后${message.EventKey}`)
            this.body = `扫码推事件用户点击按钮后${message.EventKey}`
        }else if (message.Event === "location_select") {
            console.log(`弹出地理位置选择器用户点击按钮后，微信客户端将调起地理位置选择工具${message.EventKey}`)
            this.body = `弹出地理位置选择器用户点击按钮后，微信客户端将调起地理位置选择工具${message.EventKey}`
        }
    } else if (message.MsgType === "text") {
        let content = message.Content;
        let replay = `嗯，你说的:${content},我TM看不懂`;
        if (content === "1") {
            replay = [{
                title: "重磅新品 | 你们千呼万唤的万能梳妆台与百变小酒柜来啦！",
                description: "生活可以更懂你",
                picUrl: "https://mmbiz.qpic.cn/mmbiz_jpg/1QYl6yZHptEsmpm6PJzmRwTYJZYLxwho1AdCggdKGmIfRMGplMoN0mL2T3iaia4ic4CLqjZtamNoWXkwpj69E941g/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                url: "https://mp.weixin.qq.com/s/tOUrIrgCrKB87i-WiCtQRw"
            }];
            this.weixin.MsgType = "news"
        } else if (content === "2") {
            let result = await wechatApi.uploadMeteril("image", path.join(__dirname, "../util/assets/qctive.jpg"));
            result = JSON.parse(result);
            this.weixin.MediaId = result.media_id;
            this.weixin.MsgType = result.type;
        } else if (content === "3") {
            let result = await wechatApi.uploadMeteril("thumb", path.join(__dirname, "../util/assets/ziinlife.jpg"));
            result = JSON.parse(result);
            console.log(result.thumb_media_id);
            replay = {
                title: "三十岁的女人",
                description: "她是个三十岁至今还没有结婚的女人她笑脸中眼旁已有几道波纹三十岁了光芒和激情已被岁月打磨",
                url: "http://m10.music.126.net/20181122150436/78fdb835bb0ce87d7884a8a4cfe5f3e5/ymusic/3fc7/2388/2717/53b45b66176db2639d01f51afb456ba9.mp3",
                hqMusicUrl: "http://m10.music.126.net/20181122150436/78fdb835bb0ce87d7884a8a4cfe5f3e5/ymusic/3fc7/2388/2717/53b45b66176db2639d01f51afb456ba9.mp3",
                thumbMediaId:result.thumb_media_id
            }
            this.weixin.MsgType = "music";
        } else if (content === "4") {
            let result = await wechatApi.uploadMeteril("video", path.join(__dirname, "../util/assets/ziinlife_3.mp4"));
            result = JSON.parse(result);
            this.weixin.MediaId = result.media_id;
            this.weixin.MsgType = result.type;
            replay = {
                title: "融光电视柜",
                description: "她是个三十岁至今还没有结婚的女人她笑脸中眼旁已有几道波纹三十岁了光芒和激情已被岁月打磨", 
            }
        } else if(content === "我在哪"){
            // let createGroupName = "test1";
            // let createGroup_result = await wechatApi.createGroup(createGroupName); // 创建 分组 名字
            // console.log(createGroup_result)
            let getGroupName = await wechatApi.getGroup(); // 获取分组列表
            console.log(getGroupName)
           let insertGroup = await wechatApi.batchGroup([message.FromUserName],100); // 插入分组人员
            console.log(message.FromUserName)
            console.log(insertGroup)
            let getGroupFans = await wechatApi.checkGroup(message.FromUserName); // 获取自己在那个分组列表
            console.log(getGroupFans);
            replay = "Group Over!";
        }else if(content === "我是谁"){
            let result = await wechatApi.getOneUserInfo(message.FromUserName);
            let subscribeTime = new Date(result.subscribe_time);
            console.log(result)
            // replay =
            // `昵称:${result.nickname}
            // 性别:${result.sex == 1 ?"男":"女"}
            // 户籍:${result.country}
            // 关注时间:${subscribeTime.toLocaleDateString()}         
            // ` 
            replay = [{
                title: "基本信息",
                description: `昵称:${result.nickname}性别:${result.sex == 1 ?"男":"女"}户籍:${result.country}关注时间:${subscribeTime.toLocaleDateString()}`,
                picUrl: result.headimgurl,
                url: "https://mp.weixin.qq.com/s/tOUrIrgCrKB87i-WiCtQRw"
            }]
            this.weixin.MsgType = "news"
        }
        this.weixin.Content = replay
    } else if (message.MsgType === "image") {

    } else if (message.MsgType === "voice") {

    } else if (message.MsgType === "video") {
        let content = message.Content;
        let replay = `嗯，你说的:${content},我TM看不懂`;
        replay = {
            title: "吱音五周年大片",
            description: "她是个三十岁至今还没有结婚的女人她笑脸中眼旁已有几道波纹三十岁了光芒和激情已被岁月打磨",
        }
        this.weixin.MsgType = "video";
        this.weixin.Content = replay;

    } else if (message.MsgType === "shortvideo") {

    } else if (message.MsgType === "location") {

    } else if (message.MsgType === "link") {

    }
    await next()
}

module.exports = {
    replay
}