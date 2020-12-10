import log4js from 'log4js'

let devCategories = []
devCategories.push("allFile")
if (process.env.NODE_ENV === "development") {
    devCategories.push("console")

}
log4js.configure({
    appenders: {
        // 控制台输出
        console: {type: 'console'},
        // 全部日志文件
        allFile: {type: 'file', filename: 'logs/info/server.log'},
        // 错误日志文件
        errorFile: {type: 'file', filename: 'logs/error/server-error.log'}
    },
    categories: {
        // 默认日志，输出debug 及以上级别的日志
        default: {appenders: devCategories, level: 'debug'},
        // 错误日志，输出error 及以上级别的日志
        error: {appenders: ['errorFile'], level: 'error'},
    }
});

export default log4js
