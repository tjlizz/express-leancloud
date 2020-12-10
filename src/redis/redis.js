import redis from 'redis'
import Common from "../common";
import path from "path"

let redisConfig = Common.readFile(path.normalize(path.join(__dirname, "../../redis.json")))
let {host, port} = JSON.parse(redisConfig.toString())
const redisClient = redis.createClient({
    host,
    port
});
export default redisClient

