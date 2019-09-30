// 模块用于管理及初始化组件模型实例
// 模块用于管理及初始化元素模型实例
//

// 一元素元素模型
import EM1M1 from '../elements/em1/m1';
import EM1M2 from '../elements/em1/m2';
import EM1M3 from '../elements/em1/m3';
// 二元素元素模型
import EM2M1 from '../elements/em2/m1';

// 可变元素模型
import EMXM1 from '../elements/emx/m1';

// 一元素组件模型
import WG1M1 from '../widgets/wg1/m1';
import WG1M2 from '../widgets/wg1/m1';
// 二元素组件模型
// import WG2M1 from '../widgets/wg2/m1';
// 三元素组件模型
// import WG3M1 from '../widgets/wg3/m1';
// import WG3M2 from '../widgets/wg3/m2';
// 四元素组件模型
// import WG4M1 from '../widgets/wg4/m1';

export default {
  base: [new EM1M1(), new EM1M2(), new EM1M3()],
  elements: [
    // new EM2M1()
  ],
  widgets: [
    new WG1M1(),
    new WG1M2(),

    // new WG2M1(),

    // new WG3M1(),
    // new WG3M2(),

    // new WG4M1(),
  ],
  emx: [new EMXM1()],
};
