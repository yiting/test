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

// 可变节点元素模型

const MODEL_LIST: any[] = [
  new EM1M1(),
  new EM1M2(),
  new EM1M3(),
  new EM1M4(),

  new EM2M1(),
  new EM2M2(),
  new EM2M3(),
  new EM2M4(),
];

export default MODEL_LIST;
