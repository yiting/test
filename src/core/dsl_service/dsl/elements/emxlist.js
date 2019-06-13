// 模块用于可变节点模型的匹配
//
// 一元素元素模型
const EM1M1 = require('./em1/m1.js');
const EM1M2 = require('./em1/m2.js');
const EM1M4 = require('./em1/m4.js');
// 二元素元素模型
const EM2M1 = require('./em2/m1.js');
const EM2M2 = require('./em2/m2.js');

const MODEL_LIST = [
    new EM1M1(),
    new EM1M2(),
    new EM1M4(),
    
    new EM2M1(),
    new EM2M2()
];

module.exports = MODEL_LIST;