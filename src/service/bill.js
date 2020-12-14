import LeanCloud from "../leanCloud/leanCloud";
import Common from "../common";
import AV from 'leancloud-storage'
import log4js from '../log4j/log4j'
import {messageCheck} from "../webChart/demo";
const CLASS_NAME = "BillInfo"
const errorlog = log4js.getLogger('error');
export default class Bill {
    addBill(data) {
        return new Promise(async (resolve, reject) => {
            const BillModel = LeanCloud.baseAV().Object.extend(CLASS_NAME);
            let billInfo = new BillModel();
            if (data.billRemark) {
                let mesCheck = await messageCheck(data.billRemark)
                if (mesCheck.errcode !== 0) {
                    resolve(Common.unifyResponse("内容含有违法违规内容",   ))
                }
            }
            billInfo.set("billAmount", data.billAmount);
            billInfo.set("billTime", new Date(data.billTime));
            billInfo.set("billRemark", data.billRemark);
            billInfo.set("billType", data.billType);
            billInfo.set("userId", data.userId);
            billInfo.set("billClass", data.billClass)
            billInfo.save().then(res => {
                resolve(data.id)
            }).catch(e => {
                resolve(Common.unifyResponse("新增失败", 500))
            })
        })
    }
    deleteBill(id) {
        try {
            const billInfo = new AV.Object.createWithoutData(CLASS_NAME, id);
            billInfo.destroy();
            return true;
        } catch (e) {
            return Common.unifyResponse("删除失败", 500)
        }
    }
    getBillList(year, month, userId) {
        return new Promise((resolve, reject) => {
            let startTime = year + "-" + month + "-01  "
            let endTime = year + "-" + month + "-31  "
            const startDateQuery = new AV.Query('BillInfo');
            startDateQuery.greaterThanOrEqualTo('billTime', new Date(startTime));
            const endDateQuery = new AV.Query('BillInfo');
            endDateQuery.lessThan('billTime', new Date(endTime));
            const userQuery = new AV.Query("BillInfo");
            userQuery.equalTo("userId", userId)
            const query = AV.Query.and(startDateQuery, endDateQuery, userQuery);
            query.descending('billTime');
            query.descending('orderIndex');
            let result = {cycleDate: year + '-' + month, data: []}
            query.find().then((user) => {
                result.data = user
                resolve(result)
            }).catch(e => {
                errorlog.error(e)
                resolve(Common.unifyResponse("服务异常", 500))
            });
        })
    }
    analysisData(data) {
        let result = {}
        data.forEach(item => {
            if (result[item.get("billClass")]) {
                switch (item.get("billType")) {
                    case "out":
                        result[item.get("billClass")]["out"] += parseFloat(item.get("billAmount"))
                        break;
                    case "in":
                        result[item.get("billClass")]["in"] += parseFloat(item.get("billAmount"))
                        break;
                }
            } else {
                result[item.get("billClass")] = {
                    out: 0,
                    in: 0
                }
                switch (item.get("billType")) {
                    case "out":
                        result[item.get("billClass")]["out"] = parseFloat(item.get("billAmount"))
                        break;
                    case "in":
                        result[item.get("billClass")]["in"] = parseFloat(item.get("billAmount"))
                        break;
                }
            }
        })
        return result;
    }
    billStatisticsOfYear(year, userId) {
        return new Promise((resolve, reject) => {
            let startTime = year + "-" + 1 + "-01  "
            let endTime = year + "-" + 12 + "-31  "
            const startDateQuery = new AV.Query(CLASS_NAME);
            startDateQuery.greaterThanOrEqualTo('billTime', new Date(startTime));
            const endDateQuery = new AV.Query(CLASS_NAME);
            endDateQuery.lessThan('billTime', new Date(endTime));
            const userQuery = new AV.Query(CLASS_NAME);
            userQuery.equalTo("userId", userId)
            const query = AV.Query.and(startDateQuery, endDateQuery, userQuery);
            query.find().then(data => {
                    let result = {}
                    for (let i = 1; i < 13; i++) {
                        let filterData = data.filter(t => new Date(t.get("billTime")).getMonth() + 1 == i);
                        result[i] = this.analysisData(filterData)
                    }
                    resolve(result)
                }
            )
        })
    }
}
