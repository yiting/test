import QLog from '../log/qlog';
const Loger = QLog.getInstance(QLog.moduleData.render);

import fontWidthClean from './fontWidthClean';
import wordWrapClean from './wordWrapClean';
import lineWrapClean from './lineWrapClean';
import lineHeightClean from './lineHeightClean';

export default (_nodes: any[]) => {
  let nodes: any = _nodes;
  let debugText = '';
  try {
    // 行拆分
    debugText = 'lineWrapClean';
    nodes = lineWrapClean(nodes);
    // 行高计算
    debugText = 'lineHeightClean';
    nodes = lineHeightClean(nodes);
    // 字宽计算
    debugText = 'fontWidthClean';
    nodes = fontWidthClean(nodes);
    // 干掉最后一个换行字符
    debugText = 'wordWrapClean';
    nodes = wordWrapClean(nodes);
  } catch (e) {
    Loger.error(`dsl/clean/managets ${debugText}()
        error:${e}`);
  }
  return nodes;
};
