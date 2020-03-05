// 这里定义数据输出的统一接口
// h5, ios, android, weex等

import QLog from '../dsl_layout/helper/qlog';
import TextRevise from './helper/textRevise';
import CssBoundary from './helper/boundary';
import CssConstraints from './helper/supplementConstraints';
import LayoutCleanProcess from '../dsl_layout/layout/clean';
const Loger = QLog.getInstance(QLog.moduleData.render);

class Builder {
  static modelList: any[];
  static widgetList: any[];

  getResult() {}

  dom: any;

  options: any;
  constructor(data: any, options: any, TemlateList: any[]) {
    try {
      this.options = options; // 布局样式
      this.dom = _buildTree(null, data, TemlateList);
      Loger.debug('render/builder [ReviseDomTree]');
      ReviseDomTree(this.dom);
      Loger.debug('render/builder [TextRevise]');
      TextRevise(this.dom);
      // 结构清理
      // Loger.debug('render/builder [LayoutCleanProcess]');
      // this.dom = LayoutCleanProcess(this.dom);
    } catch (e) {
      Loger.error(`render/builder [constructor]:${e}`);
    }
  }
}

function ReviseDomTree(domTree: any) {
  CssBoundary(domTree);
  CssConstraints(domTree);
  if (domTree.children) {
    domTree.children.forEach((child: any) => {
      ReviseDomTree(child);
    });
  }
}
/**
 * 构建cssDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(parent: any, data: any, TemplateList: any[]) {
  let dom: any;
  try {
    let Template =
      TemplateList.find((temp: any) => temp.name === data.constructor.name) ||
      TemplateList[0];

    dom = new Template(data, parent);
    // 构建树
    if (parent) {
      parent.children.push(dom);
    }
    data.children.forEach((d: any) => {
      _buildTree(dom, d, TemplateList);
    });
  } catch (e) {
    Loger.error(`${__dirname} [_buildTree]: ${e}`);
  }
  return dom;
}
export default Builder;
