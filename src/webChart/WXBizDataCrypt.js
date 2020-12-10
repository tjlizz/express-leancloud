var crypto = require('crypto')
export default class WXBizDataCrypt {
  static decryptData(encryptedData, iv, appId, _sessionKey) {
    var sessionKey = Buffer.from(_sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')
    try {
      // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)

    } catch (err) {
      return null;
    }
    if (decoded.watermark.appid !== appId) {
      return null;
    }
    return decoded
  }
}
