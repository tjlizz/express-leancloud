import LeanCloud from "../leanCloud/leanCloud";
import Common from "../common";
import AV from 'leancloud-storage'
import log4js from '../log4j/log4j'

const errorlog = log4js.getLogger('error');
const infolog = log4js.getLogger('info');
export default class Bill {
    addBill(data) {
        return new Promise((resolve, reject) => {
            const BillModel = LeanCloud.baseAV().Object.extend('BillInfo');
            let billInfo = new BillModel();
            billInfo.set("billAmount", data.billAmount);
            billInfo.set("billTime", new Date(data.billTime));
            billInfo.set("billRemark", data.billRemark);
            billInfo.set("billType", data.billType);
            billInfo.set("userId", data.userId);
            billInfo.set("billClass", data.billClass)
            billInfo.save().then(res => {
                resolve(res.id)
            }).catch(e => {

                resolve(Common.unifyResponse("新增失败", 500))
            })
        })
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
            let result = {cycleDate: year + '-' + month, data: []}
            query.find().then((user) => {
                result.data = user
                resolve(result)
            }).catch(e => {
                errorlog.error(e)
                infolog.info("info")
                resolve(Common.unifyResponse("服务异常", 500))
            });
        })
    }


}
