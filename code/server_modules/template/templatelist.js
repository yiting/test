//模块用于加载模板文件
//1.基础组件
//1元素
const EM1M1 = require("./html/elements/em1/m1");
const EM1M2 = require("./html/elements/em1/m2");
const EM1M3 = require("./html/elements/em1/m3");
const EM1M4 = require("./html/elements/em1/m4");
//2元素
const EM2M1 = require("./html/elements/em2/m1");
const EM2M2 = require("./html/elements/em2/m2");
const EM2M3 = require("./html/elements/em2/m3");
const EM2M4 = require("./html/elements/em2/m4");
//3元素
const EM3M1 = require("./html/elements/em3/m1");
const EM3M2 = require("./html/elements/em3/m2");
const EM3M3 = require("./html/elements/em3/m3");
const EM3M4 = require("./html/elements/em3/m4");
const EM3M5 = require("./html/elements/em3/m5");
const EM3M6 = require("./html/elements/em3/m6");
const EM3M7 = require("./html/elements/em3/m7");
const EM3M8 = require("./html/elements/em3/m8");
const EM3M9 = require("./html/elements/em3/m9");
//2.复合组件
//2元素
const WG2M1 = require("./html/widgets/wg2/m1");
const WG2M2 = require("./html/widgets/wg2/m2");
const WG2M3 = require("./html/widgets/wg2/m3");
const WG2M4 = require("./html/widgets/wg2/m4");
const WG2M6 = require("./html/widgets/wg2/m6");
const WG2M7 = require("./html/widgets/wg2/m7");
//3元素
const WG3M1 = require("./html/widgets/wg3/m1");
const WG3M2 = require("./html/widgets/wg3/m2");
// const WG3M3 = require("./html/widgets/wg3/m3");
//4元素
const WG4M1 = require("./html/widgets/wg4/m1");
const WG4M2 = require("./html/widgets/wg4/m2");
const WG4M3 = require("./html/widgets/wg4/m3");
//5元素
const WG5M1 = require("./html/widgets/wg5/m1");

const WGNM1 = require("./html/widgets/wgn/m1");
//模板数组
const TEMPLATE_LIST = [
  EM1M1,
  EM1M2,
  EM1M3,
  EM1M4,

  EM2M1,
  EM2M2,
  EM2M3,
  EM2M4,

  EM3M1,
  EM3M2,
  EM3M3,
  EM3M4,
  EM3M5,
  EM3M6,
  EM3M7,
  EM3M8,
  EM3M9,

  WG2M1,
  WG2M2,
  WG2M3,
  WG2M4,
  WG2M6,
  WG2M7,

  WG3M1,
  WG3M2,
  // WG3M3,
  WG4M1,
  WG4M2,
  WG4M3,

  WG5M1,

  WGNM1
];

module.exports = TEMPLATE_LIST;
