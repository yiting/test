// 模块用于可变节点模型的匹配
//
// 一元素元素模型
import EM1M1 from './em1/m1';
import EM1M2 from './em1/m2';
import EM1M4 from './em1/m4';
// 二元素元素模型
import EM2M1 from './em2/m1';
import EM2M2 from './em2/m2';

const MODEL_LIST = [
  new EM1M1(),
  new EM1M2(),
  new EM1M4(),

  new EM2M1(),
  new EM2M2(),
];

export default MODEL_LIST;
