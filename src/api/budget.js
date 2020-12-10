import express from 'express';
import Common from "../common";
import budget from "../service/budget";
let budgetService = new budget();
let budgetRouter = express.Router();
budgetRouter.post('/', async (req, res) => {
    const userId = req["userId"];
    let body = req.body;
    body["userId"] = userId;
    let result = await budgetService.addBudget(body)
    Common.sendResponse(result, res)

})

budgetRouter.put('/', async (req, res) => {
    let result = await budgetService.updateBudget(req.body)
    Common.sendResponse(result, res)
})
budgetRouter.get('/:year/:month', async (req, res) => {
    const userId = req["userId"];
    let year = req.params.year;
    let month = req.params.month;
    let list = await budgetService.getBudgetList(userId, year, month)
    Common.sendResponse(list, res)


})
