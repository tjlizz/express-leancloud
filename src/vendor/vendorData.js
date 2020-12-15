import Common from "../common";
import axios from "axios";
import redisClient from "../redis/redis";

let vendorApi = Common.readFile("api.json")
vendorApi = JSON.parse(vendorApi.toString())
let {weatherApi, weatherKey} = vendorApi

export default class vendorData {
    getWeather(city) {
        return new Promise((resolve, reject) => {
            let apiUrl = `weatherApi?key=${weatherKey}&city=${city}`
            axios.get(apiUrl).then(data => {

                resolve(data)

            })
        })
    }

}
