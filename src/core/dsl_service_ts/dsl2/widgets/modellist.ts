// 模块用于管理及初始化组件模型实例

// 一元素组件模型
import WG1M1 from './wg1/m1';
import WG1M2 from './wg1/m2';
// 二元素组件模型
import WG2M1 from './wg2/m1';
// 三元素组件模型
import WG3M1 from './wg3/m1';
import WG3M2 from './wg3/m2';
import WG3M3 from './wg3/m3';
// 四元素组件模型
import WG4M1 from './wg4/m1';

const MODEL_LIST: any[] = [
  new WG1M1(),
  new WG1M2(),

  new WG2M1(),

  new WG3M1(),
  new WG3M2(),
  // new WG3M3(),

  // new WG4M1(),
];

export default MODEL_LIST;
