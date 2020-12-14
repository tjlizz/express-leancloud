import express from 'express';
import Bill from "../service/bill";
import Common from "../common";
import user from "./user";

let billService = new Bill();
let billRouter = express.Router();
billRouter.post('/', async (req, res, next) => {
    let data = req.body;
    let userId = req["userId"]
    if (!userId) {
        Common.sendResponse(Common.unifyResponse("请重新登录", 403));
        return
    }
    data["userId"] = userId;
    let result = await billService.addBill(data)
    Common.sendResponse(result, res);
})
billRouter.delete("/:id", async (req, res) => {
    let objectId = req.params.id;
    let result = billService.deleteBill(objectId);
    Common.sendResponse(result, res)
})

billRouter.get("/statistics/year/:year", async (req, res) => {
    const userId = req["userId"]
    console.log(userId,"userId");
    const year = req.params.year
    let result = await billService.billStatisticsOfYear(year, userId)
    Common.sendResponse(result, res)
})
billRouter.get('/:year/:month', async (req, res, next) => {
    const userId = req["userId"]
    const year = req.params.year
    const month = req.params.month
    let result = await billService.getBillList(year, month, userId)
    Common.sendResponse(result, res)
})
export default billRouter
