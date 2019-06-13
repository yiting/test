// 模块用于管理及初始化元素模型实例
//
// 一元素元素模型
import EM1M1 from './em1/m1';
import EM1M2 from './em1/m2';
import EM1M3 from './em1/m3';
import EM1M4 from './em1/m4';
// 二元素元素模型
import EM2M1 from './em2/m1';
import EM2M2 from './em2/m2';
import EM2M3 from './em2/m3';
import EM2M4 from './em2/m4';
import EM2M5 from './em2/m5';
import EM2M6 from './em2/m6';
import EM2M7 from './em2/m7';

// 可变节点
import EMXM1 from './emx/m1';

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
  // new EM2M6(),
  new EM2M7(),
];

export default MODEL_LIST;
