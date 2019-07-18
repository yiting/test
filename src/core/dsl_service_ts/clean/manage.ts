import QLog from '../log/qlog';
const Loger = QLog.getInstance(QLog.moduleData.render);

import fontWidthClean from './fontWidthClean';
import wordWrapClean from './wordWrapClean';
import lineWrapClean from './lineWrapClean';

export default (_nodes: any[]) => {
  let nodes: any = _nodes;
  let debugText = '';
  try {
    debugText = 'fontWidthClean';
    nodes = fontWidthClean(nodes);
    debugText = 'fontWidthClean';
    nodes = wordWrapClean(nodes);
    // debugText = 'lineWrapClean';
    // nodes = lineWrapClean(nodes);
  } catch (e) {
    Loger.error(`dsl/clean/managets ${debugText}()
        error:${e}`);
  }
  return nodes;
};
