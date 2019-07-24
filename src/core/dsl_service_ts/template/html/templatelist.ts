// 模块用于加载模板文件
// 1.基础组件
import EMXM1 from './elements/emx/m1';
// 1元素
import EM1M1 from './elements/em1/m1';
import EM1M2 from './elements/em1/m2';
// 2元素
import EM2M1 from './elements/em2/m1';
import EM2M2 from './elements/em2/m1';
// 2.复合组件
import WG0M1 from './widgets/wg0/m1';
// 单元素
import WG1M1 from './widgets/wg1/m1';
// 2元素
import WG2M1 from './widgets/wg2/m1';
// 3元素
import WG3M1 from './widgets/wg3/m1';
import WG3M2 from './widgets/wg3/m2';
// 4元素
import WG4M1 from './widgets/wg4/m1';

import WGNM1 from './widgets/wgn/m1';
import WG1M2 from './widgets/wg1/m1';
import EM1M3 from './elements/em1/m3';
// 模板数组
export default [
  EMXM1,

  EM1M1,
  EM1M2,
  EM1M3,

  EM2M1,
  EM2M2,

  WG0M1,

  WG1M1,
  WG1M2,

  WG2M1,

  WG3M1,
  WG3M2,

  WG4M1,

  WGNM1,
];
