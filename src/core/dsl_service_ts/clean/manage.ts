import QLog from '../log/qlog';
const Loger = QLog.getInstance(QLog.moduleData.render);

import fontWidthClean from './fontWidthClean';
import wordWrapClean from './wordWrapClean';

export default (nodes: any[]) => {
  let debugText = '';
  try {
    nodes.forEach((nd: any) => {
      debugText = 'fontWidthClean';
      fontWidthClean(nd);
      debugText = 'fontWidthClean';
      wordWrapClean(nd);
    });
  } catch (e) {
    Loger.error(`dsl/clean/managets ${debugText}()
        error:${e}`);
  }
  return nodes;
};
