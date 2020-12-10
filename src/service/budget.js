import LeanCloud from "../leanCloud/leanCloud";
import Common from "../common";
import AV from "leancloud-storage";

const CLASS_NAME = 'BudgetInfo'
export default class Budget {
    addBudget(data) {
        return new Promise((resolve, reject) => {
            const BudgetModel = LeanCloud.baseAV().Object.extend(CLASS_NAME);
            let budgetModel = new BudgetModel();
            budgetModel.set("budgetAmount", data.budgetAmount);
            budgetModel.set("userId", data.userId);
            budgetModel.set("budgetYear", data.budgetYear);
            budgetModel.set("budgetMonth", data.budgetMonth);
            budgetModel.save().then(res => {
                resolve(res.id)
            }).catch(e => {
                resolve(Common.unifyResponse("新增失败", 500))
            })
        })
    }

    updateBudget(data) {
        return new Promise((resolve, rejece) => {
            const todo = AV.Object.createWithoutData(CLASS_NAME, data.id);
            todo.set('budgetAmount', data.budgetAmount);
            todo.save().then(() => {
                resolve(true)
            }).catch(e => {
                resolve(Common.unifyResponse("修改失败", 500))

            })


        })

    }

    getBudgetList(userId, year, month) {
        return new Promise((resolve, reject) => {
            const query = new AV.Query(CLASS_NAME);
            query.equalTo('userId', userId);
            query.equalTo('budgetYear', year);
            query.equalTo('budgetMonth', month);
            query.find().then((list) => {
                resolved(list)
            }).catch(e => {
                resolve(Common.unifyResponse("查询预算失败", 500))
            });

        })


    }

}
