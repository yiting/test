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
// 三元素元素模型
const EM3M1 = require('./em3/m1.js');
const EM3M2 = require('./em3/m2.js');
const EM3M3 = require('./em3/m3.js');
const EM3M4 = require('./em3/m4.js');
const EM3M5 = require('./em3/m5.js');
const EM3M6 = require('./em3/m6.js');
const EM3M7 = require('./em3/m7.js');
const EM3M8 = require('./em3/m8.js');
const EM3M9 = require('./em3/m9.js');

const MODEL_LIST = [
    // 一元素模型
    new EM1M1(),
    new EM1M2(),
    new EM1M3(),
    new EM1M4(),
    // 二元素模型
    new EM2M1(),
    new EM2M2(),
    // 三元素模型
    new EM3M1(),
    new EM3M2(),
    new EM3M3(),
    new EM3M4(),
    new EM3M5(),
    new EM3M6(),
    new EM3M7(),
    new EM3M8(),
    new EM3M9()
];

module.exports = MODEL_LIST;