import express from 'express';
import Bill from "../service/bill";
import Common from "../common";

let billService = new Bill();
let billRouter = express.Router();
billRouter.post('/', async (req, res, next) => {
    let data = req.body;
    data["userId"] = req["userId"]
    let result = await billService.addBill(data)
    Common.sendResponse(result, res);
})

billRouter.get('/:year/:month', async (req, res, next) => {
    const userId = req["userId"]
    const year = req.params.year
    const month = req.params.month

    let result = await billService.getBillList(year, month, userId)
    Common.sendResponse(result, res)
})
export default billRouter
