let path = require("path");
const wechat_file = path.join(__dirname, "../config/accessToken.txt");
const util = require("../libs/util")
module.exports = {
    wechat: {
        token: "20180416",
        appID: "wxebd0b2e5bcd4d555",
        appsecret: "d38a3f86111c5627dc616502883bf296",
        getAccessToken(){
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken(data){
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}
