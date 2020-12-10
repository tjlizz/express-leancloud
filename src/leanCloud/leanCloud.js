import Common from "../common";

import path from 'path'

let AV = require('leancloud-storage');

let leanCloudConfig = Common.readFile(path.join(__dirname, "../../leanCloud.json"))
leanCloudConfig = JSON.parse(leanCloudConfig.toString())
export default class LeanCloud {
    constructor() {
        AV.init(leanCloudConfig);
    }

    static baseAV() {
        return AV
    }
}
