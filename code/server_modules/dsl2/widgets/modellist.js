// 模块用于管理及初始化组件模型实例

// 一元素组件模型

// 二元素组件模型
const WG2M1 = require('./wg2/m1.js');
const WG2M2 = require('./wg2/m2.js');
const WG2M3 = require('./wg2/m3.js');
const WG2M4 = require('./wg2/m4.js');
const WG2M5 = require('./wg2/m5.js');
const WG2M6 = require('./wg2/m6.js');
// 三元素组件模型
const WG3M1 = require('./wg3/m1.js');
const WG3M2 = require('./wg3/m2.js');
// const WG3M3 = require('./wg3/m3.js');
// 四元素组件模型
const WG4M1 = require('./wg4/m1.js');
const WG4M2 = require('./wg4/m2.js');
const WG4M3 = require('./wg4/m3.js');
// 五元素组件模型
const WG5M1 = require('./wg5/m1.js');

const MODEL_LIST = [
    // 一元素模型

    // 二元素模型
    new WG2M1(),
    new WG2M2(),
    new WG2M3(),
    new WG2M4(),
    //new WG2M5(),
    new WG2M6(),
    // 三元素模型
    new WG3M1(),
    new WG3M2(),
    // new WG3M3(),
    // 四元素模型
    new WG4M1(),
    new WG4M2(),
    new WG4M3()
];

module.exports = MODEL_LIST;