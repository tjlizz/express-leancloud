import LeanCloud from '../leanCloud/leanCloud.js'
import {
    v4 as uuidv4
} from 'uuid';
import AV from 'leancloud-storage'
import Common from "../common";

const addUser = (data) => {
    return new Promise(async (resolved, reject) => {
        let userList = await getUser(data.unionId)
        if (userList && userList.length > 0) {
            console.log(userList[0].get("objectId"));
            if (userList[0].get("avatarUrl") != data.avatarUrl) {
                const todo = AV.Object.createWithoutData('UserInfo', userList[0].get("objectId"));
                todo.set('avatarUrl', data.avatarUrl);
                todo.save();
            }
            resolved(userList[0].get("userId"))
            return
        }
        console.log(data);
        const User = LeanCloud.baseAV().Object.extend('UserInfo');
        let user = new User();
        user.set('userId', uuidv4());
        user.set('city', data.city)
        user.set("avatarUrl", data.avatarUrl)
        user.set('province', data.province)
        user.set('country', data.country)
        user.set('gender', data.gender.toString())
        user.set('unionId', data.unionId)
        user.save().then((user) => {
            // 成功保存之后，执行其他逻辑
            resolved(user.userId)
        }, (error) => {
            console.log(error)
        });
    })


}

const getUser = (unionId) => {
    return new Promise((resolved, reject) => {
        const query = new AV.Query('UserInfo');
        query.equalTo('unionId', unionId);
        query.find().then((user) => {
            resolved(user)
        });
    })
}
const getUserByUserId = (userId) => {
    return new Promise((resolved, reject) => {
        const query = new AV.Query('UserInfo');
        query.equalTo('userId', userId);
        query.find().then((user) => {
            if (user.length > 0)
                resolved(user[0])
            else
                resolved(null)
        }).catch(e => {
            resolved(Common.unifyResponse("获取用户失败", 500))
        });
    })
}

export {
    addUser,
    getUserByUserId
}
