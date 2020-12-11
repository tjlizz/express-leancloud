
![](https://img.shields.io/badge/express-%5E4.17.1-brightgreen)
![](https://img.shields.io/badge/leancloud-%5E4.8.0-brightgreen)
![](https://img.shields.io/badge/babel-%5E7.12.8-brightgreen)
![](https://img.shields.io/badge/redis-%5E3.0.2-brightgreen)
![](https://img.shields.io/badge/jsonwebtoken-%5E8.5.1-brightgreen)

# 准备开始
```
 $ git clone https://github.com/lizeze/express-leancloud.git
```
下载完成之后进入项目创建以下几个文件
```shell script
$ cd express-leancloud
```

 *  redis.json
  ```json
{
      "host": "192.168.11.57",
      "port": 6379,
      "passWord": "123456"

}
```
 * jwt.json
 ```json
{
  "expiresIn": "1h",
  "privateKey": "xxxx"
}
```
* leanCloud.json
```json
{
  "appId": "xxx",
  "appKey": "xxx",
  "serverURL": "xxx"
}
```
* webChat.json
```json
{
  "appId": "xxx",
  "secretKey": "xxx"
}
```
* api.json
```json
{
  "socketUrl": "xxx",
  "defaultUserId": "123"  
}
```
 开发环境填写`defaultUserId`可跳过jwt校验，直接访问api, **正式环境一定要修改成 ""**
 
最后使用`npm`或者`yarm` 安装项目依赖
```shell script
$ npm i 
$ npm start
```

线上小程序

![](webchat.jpg)
