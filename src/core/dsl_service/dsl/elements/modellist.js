// 模块用于管理及初始化元素模型实例
//
// 一元素元素模型
const EM1M1 = require('./em1/m1.js');
const EM1M2 = require('./em1/m2.js');
const EM1M3 = require('./em1/m3.js');
const EM1M4 = require('./em1/m4.js');
// 二元素元素模型
const EM2M1 = require('./em2/m1.js');
const EM2M2 = require('./em2/m2.js');
const EM2M3 = require('./em2/m3.js');
const EM2M4 = require('./em2/m4.js');
const EM2M5 = require('./em2/m5.js');
const EM2M6 = require('./em2/m6.js');


// 可变节点
const EMXM1 = require('./emx/m1.js');

const MODEL_LIST = [
    // 可变节点模型,会优先匹配,SS优先级
    new EMXM1(),
    // 一元素模型
    new EM1M1(),
    new EM1M2(),
    new EM1M3(),
    new EM1M4(),
    // 二元素模型
    new EM2M1(),
    new EM2M2(),
    new EM2M3(),
    new EM2M4(),
    new EM2M5(),
    new EM2M6()
];

module.exports = MODEL_LIST;