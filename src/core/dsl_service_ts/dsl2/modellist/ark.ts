// 一元素元素模型
import EM1M1 from '../elements/em1/m1';
import EM1M2 from '../elements/em1/m2';
import EM1M3 from '../elements/em1/m3';
import EM1M4 from '../elements/em1/m4';
// 可变元素模型
import EMXM1 from '../elements/emx/m1';

export default {
  base: [new EM1M1(), new EM1M2(), new EM1M3(), new EM1M4()],
  elements: [],
  widgets: [],
  emx: [new EMXM1()],
};
