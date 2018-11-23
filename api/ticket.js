const request = require("request")
module.exports = function(access_token){
    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    return new Promise(function(resolve,reject){
        request.get(url,function(err,response,body){
            console.log(body)
            if(!err && response.statusCode == 200){
                resolve(body)
            }
        })
    })
}