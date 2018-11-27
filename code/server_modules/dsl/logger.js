let Level = 0;
let obj = {};

obj.level = function (level) {
    console.info(`Logger level is ${Level}`);
}
obj.debug = function (info) {
    console.debug(info)
}
obj.warn = function (error) {
    console.warn(error);
}
obj.error = function (error) {
    console.error(error);
}
const isWeb = (typeof self == 'object' && self.self == self);
if (isWeb) {
    module.exports = obj
} else {
    let qlog = require("../log/qlog.js");
    module.exports = qlog.getInstance(qlog.moduleData.img);
}