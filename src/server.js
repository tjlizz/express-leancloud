import express from 'express';
import LoingRouter from './api/webChat'
import billRouter from './api/bill'
import LeanCloud from './leanCloud/leanCloud.js'
import {verifyToken} from "./jwt/jwt";
import userRouter from "./api/user";
import Common from "./common";
import path from 'path'

const port = 3000
new LeanCloud()
const app = express();
let apiConfig = Common.readFile(path.join(__dirname, "../api.json"))
apiConfig = JSON.parse(apiConfig.toString())
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
let passUrl = ['/', '/api/wx']
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});
app.use(express.static('public'));
app.use(async (req, res, next) => {
    if (req.url.indexOf('/api/wx') !== -1 && !req.header("accessToken")) {
        next()
        return
    }
    if (req.url == '/index.html' || req.url == "/" || req.url.indexOf('jpeg') !== -1) {
        next()
        return
    }

    if (apiConfig.defaultUserId) {
        next()
        return
    }
    const accessToken = req.header("accessToken")
    let verifyRes = await verifyToken(accessToken)
    if (verifyRes.err) {
        res.status(403).send('请重新登录')
        return
    }
    req["userId"] = verifyRes.data.userId
    next()

})
app.get('/api/a', (req, res) => {
    res.send('444')
})
app.use('/api/wx', LoingRouter)
app.use('/api/bill', billRouter)
app.use("/api/user", userRouter)
app.listen(port, () =>
    console.log('Example app listening on port 3000!'),
);
