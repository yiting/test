const qlog = require('../log/qlog');
// 平台模块多一条 -结束

const logger = qlog.getInstance(qlog.moduleData.json);
const LOG_TYPE = {
  LOG4J: logger,
  SYSTEM: console,
};
const _Console = LOG_TYPE.SYSTEM;
module.exports = {
  log(str) {
    return console.log(str);
  },
  warn(str) {
    return _Console.warn(str);
  },
  error(str) {
    return _Console.error(str);
  },
};
