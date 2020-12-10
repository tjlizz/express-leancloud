import express from 'express';
import {getUserByUserId} from "../service/user";
let userRouter = express.Router();
userRouter.get("/", async (req, res) => {
    let userId = req["userId"];
    let userData = await getUserByUserId(userId);
    // Common.sendResponse(userData.avatarUrl, res)
    res.send(userData.get("avatarUrl"))
})
export default userRouter
