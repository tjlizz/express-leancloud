import path from 'path'
import fs from 'fs'

export default class Common {
    static sendResponse(data, res) {
        if (!data) {
            res.send(data)
            return
        }
        if (data.error_code) {
            res.status(data.error_code).send(data)
            return
        }
        res.send(data)

    }

    static unifyDataResponse(data, error_code) {
        error_code = error_code ? error_code : 0
        return {
            data, error_code
        }
    }


    static unifyResponse(mess, error_code) {
        return {
            mess, error_code
        }
    }

    static config(name) {
        let configObj = {
            "qrCode": path.normalize(path.join(__dirname, '../public', '/'))
        }
        return configObj[name]
    }

    static setTimeDateFmt(s) {  // 个位数补齐十位数
        return s < 10 ? '0' + s : s;
    }

    static randomNumber() {
        const now = new Date()
        let month = now.getMonth() + 1
        let day = now.getDate()
        let hour = now.getHours()
        let minutes = now.getMinutes()
        let seconds = now.getSeconds()
        month = Common.setTimeDateFmt(month)
        day = Common.setTimeDateFmt(day)
        hour = Common.setTimeDateFmt(hour)
        minutes = Common.setTimeDateFmt(minutes)
        seconds = Common.setTimeDateFmt(seconds)
        let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 10000000)).toString();
        return orderCode;
    }

    static readFile(filePath) {
        return fs.readFileSync(path.normalize(filePath));
    }
}
