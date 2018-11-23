const fs = require("fs")
const xml2js = require("xml2js") // xml 转化为json
const tpl = require("./tpl")
module.exports.readFileAsync = (rs_path) => {
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
module.exports.writeFileAsync = (f_path, content) => {
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
module.exports.parseXmlAysnc = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {
            trim: true
        }, (err, content) => {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}

function formatMessage(result) {
    let message = {};
    if (typeof result === "object") {
        let k = Object.keys(result);
        for (let item of k) {
            let resultVal = result[item];
            if (!(resultVal instanceof Array) || resultVal.length === 0) {
                continue
            }
            if (resultVal.length === 1) {
                let val = resultVal[0];
                if (typeof val === "object") {
                    message[item] = formatMessage(val)
                } else {
                    message[item] = (val || "").trim()
                }
            }else{
                message[item] = [] ;
                for(let i = 0 ; i < resultVal.length; i++){
                    message[item].push(formatMessage(resultVal[i]))
                }
            }

        }
        return message
    }

}
module.exports.formatMessage = formatMessage
module.exports.tpl = (message)=>{
    let info = Object.create(null);
    let type = message.MsgType;
    let fromUserName = message.FromUserName;
    let toUserName = message.ToUserName;
    info.createTime = new Date().getTime();
    info.fromUserName = toUserName;
    info.toUserName = fromUserName;
    info.content = message.Content;
    info.createTime = message.CreateTime;
    info.msgType = type;
    info.media_id = message.MediaId;
    info.msgId = message.MsgId;
    info.picUrl = message.PicUrl;
    console.log("info")
    return tpl.comliled(info)
}
