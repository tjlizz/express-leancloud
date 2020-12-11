import jwt from 'jsonwebtoken'
import path from 'path'
import Common from "../common";


let jwtConfig = Common.readFile(path.join(__dirname, "../../jwt.json"))
let {privateKey, expiresIn} = JSON.parse(jwtConfig.toString())
export let makeToken = (userId) => {

    let accessToken = jwt.sign({userId}, privateKey, {expiresIn: expiresIn});
    return   accessToken


}
export let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, privateKey, function (err, decoded) {
                resolve({err, data: decoded})
            });
        } catch (e) {
            resolve({err: e, data: null})


        }
    })
}



