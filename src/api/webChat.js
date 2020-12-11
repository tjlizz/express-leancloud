import express from 'express';
import {
    v4 as uuidv4
} from 'uuid';
import axios from 'axios'

let LoginRouter = express.Router();
import * as webChat from '../webChart/demo'
import {
    addUser
} from '../service/user.js'
import path from 'path'
import {makeToken} from "../jwt/jwt";
import {getQRCode, getWebChatAccessToken} from "../webChart/demo";
import Common from "../common";

let apiConfig = Common.readFile(path.join(__dirname, "../../api.json"))
apiConfig = JSON.parse(apiConfig.toString())
LoginRouter.post('/decrypt', async (req, res) => {
    try {
        let {
            encryptedData,
            iv,
            jsCode
        } = req.body
        let loginResult = await webChat.webChatLogin(jsCode)
        let data = webChat.decryptData(encryptedData, iv, loginResult.session_key)
        if (!data) res.status(403).send("登录失败")
        let userId = await addUser(data)
        const accessToken = makeToken(userId)
        res.send(accessToken)
    } catch (e) {
        res.status(500).send(e)
    }
})

LoginRouter.get('/qrcode', async (req, res) => {
    let accessToken = await getWebChatAccessToken()
    let result = await getQRCode(accessToken)
    Common.sendResponse(result, res)
})

LoginRouter.post("/qrlogin/:clientId", (req, res) => {
    let userId = req["userId"];
    let clientId = req.params.clientId
    let token = makeToken(userId);
    axios.post(apiConfig.socketUrl, {
        clientId,
        message: token
    })
    res.send(true)

})
export default LoginRouter
