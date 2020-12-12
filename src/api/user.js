import express from 'express';
import {getUserByUserId} from "../service/user";

let userRouter = express.Router();
userRouter.get("/", async (req, res) => {
    let userId = req["userId"];
    let userData = await getUserByUserId(userId);
    let nickName = userData.get("nickName")
    let avatarUrl = userData.get("avatarUrl")
    // Common.sendResponse(userData.avatarUrl, res)
    res.send({
        nickName, avatarUrl
    })
})
export default userRouter
