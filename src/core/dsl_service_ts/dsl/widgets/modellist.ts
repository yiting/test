// 模块用于管理及初始化组件模型实例

// 一元素组件模型
import WG1M1 from './wg1/m1';

// 二元素组件模型
import WG2M1 from './wg2/m1';
import WG2M2 from './wg2/m2';
import WG2M3 from './wg2/m3';
import WG2M4 from './wg2/m4';
import WG2M5 from './wg2/m5';
// 三元素组件模型
import WG3M1 from './wg3/m1';
import WG3M2 from './wg3/m2';
import WG3M3 from './wg3/m3';
// 四元素组件模型
import WG4M1 from './wg4/m1';
import WG4M2 from './wg4/m2';
import WG4M3 from './wg4/m3';
// 五元素组件模型
import WG5M1 from './wg5/m1';

const MODEL_LIST = [
  // 一元素模型
  new WG1M1(),

  // 二元素模型
  new WG2M1(),
  new WG2M2(),
  new WG2M3(),
  new WG2M4(),
  // new WG2M5(),
  // 三元素模型
  new WG3M1(),
  new WG3M2(),
  new WG3M3(),
  // 四元素模型
  new WG4M1(),
  // new WG4M2(),
  new WG4M3(),
];

export default MODEL_LIST;
