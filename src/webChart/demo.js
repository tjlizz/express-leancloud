import WXBizDataCrypt from './WXBizDataCrypt'
import axios from 'axios'
import Common from "../common";
import log4js from "../log4j/log4j";
import redisClient from "../redis/redis";
import fs from 'fs'
import path from 'path'

const errorlog = log4js.getLogger('error');
let webChatConfig = Common.readFile(path.join(__dirname, "../../webChat.json"))
let {appId, secretKey} = JSON.parse(webChatConfig.toString())

const decryptData = (
    encryptedData,
    iv, sessionKey
) => {

    return WXBizDataCrypt.decryptData(encryptedData, iv, appId, sessionKey)
}
const getWebChatAccessToken = () => {
    return new Promise((resolve, reject) => {
        redisClient.get("wxAccessToken", (error, reply) => {
            if (reply) {
                resolve(reply)
                return
            } else {
                let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secretKey}`
                axios.get(url).then(res => {
                    redisClient.set("wxAccessToken", res.data.access_token)
                    redisClient.expire("wxAccessToken", res.data.expires_in)
                    resolve(res.data)
                }).catch(e => {
                    errorlog.error(e)
                    resolve(Common.unifyResponse("获取微信token失败", 500))
                })
            }
        })
    })
}
const webChatLogin = (code => {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secretKey}&js_code=${code}&grant_type=authorization_code`
    return new Promise((resolve, reject) => {
        axios.get(url).then(data => {
            resolve(data.data)
        }).catch(e => {
            console.log(e)
        })
    })
})
const getQRCode = (access_token) => {
    return new Promise((resolve, reject) => {
        let fileName = Common.randomNumber()
        let url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`
        axios.request({
            method: 'post',
            responseType: 'arraybuffer',
            url,
            data: {
                scene: "clientId=" + fileName,
                page: 'pages/login/login',
            },
            headers: {
                'Content-Type': 'application/json;charset=null'
            }
        }).then(res => {
            fs.writeFile(Common.config("qrCode") + fileName + ".jpeg", res.data, "binary", function (err) {
                resolve(fileName)
            });
        }).catch(e => {
            errorlog.error(e)
            resolve(Common.unifyResponse("获取二维码失败", 500))
        })
    })
}
const getAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:8080/api/user/accesstoken", user).then(data => {
            resolve(data.data)
        }).catch(e => {

            console.log('错了吗')
        })
    })

}
const messageCheck = (content) => {
    return new Promise(async (resolve, reject) => {
        const accessToken = await getWebChatAccessToken();
        console.log(content,'要判断的消息');
        axios.post(`https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${accessToken}`, {
            content:content
        }).then(data => {
            resolve(data.data)
        }).catch(e => {
            resolve(Common.unifyResponse("微信服务异常", 500))
        })
    })
}
export {
    getAccessToken,
    webChatLogin,
    decryptData,
    getWebChatAccessToken,
    getQRCode,
    messageCheck
}
