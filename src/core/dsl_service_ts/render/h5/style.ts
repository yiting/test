// 样式的计算处理
import QLog from '../../log/qlog';

import TextRevise from '../helper/textRevise';

import ReviseDomTree from '../helper/reviseDomTree';
// import css_combo_extend_tree from './css_combo_extend_tree';

import CssDom from './model/css_dom';

const Loger = QLog.getInstance(QLog.moduleData.render);
// 生成的Css记录树
let cssDomTree = null;
/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
const _parseTree = function(arr: any[], dom: any, similarData: any) {
  try {
    const similarCss =
      similarData[dom.similarId] && similarData[dom.similarId].css;
    const str = dom.getCss(similarCss);
    if (str) {
      arr.push(str);
    }
    dom.children.forEach((child: any) => {
      _parseTree(arr, child, similarData);
    });
  } catch (e) {
    Loger.error(`css_dom.js [_parseTree] ${e},params[dom.id:${dom && dom.id}]`);
  }
};

function getCssString(_cssDomTree: any, _similarData: any) {
  // 获取cssTree解析出的样式
  const css: any[] = []; // 每个CssDom节点返回的样式数组
  // css_combo_extend_tree.countCombo(_cssDomTree);
  _parseTree(css, _cssDomTree, _similarData);
  return css.join('\n');
}

function getCssMap(_cssDom: any, _map: any = {}) {
  // 获取cssTree解析出的样式
  try {
    _map[_cssDom.id] = _cssDom;

    _cssDom.children.forEach((child: any) => {
      getCssMap(child, _map);
    });
  } catch (e) {
    Loger.error(
      `css_dom.js [getCssMap] ${e},params[dom.id:${_cssDom && _cssDom.id}]`,
    );
  }
  return _map;
}

/**
 * 构建cssDom树
 * @param {Object} parent
 * @param {Json} data
 */
const _buildTree = function(parent: any, data: any) {
  let cssNode: any;
  try {
    cssNode = new CssDom(data, parent);
    // 构建树
    if (!parent) {
      cssDomTree = cssNode;
    } else {
      parent.children.push(cssNode);
    }
    data.children.forEach((d: any) => {
      _buildTree(cssNode, d);
    });
  } catch (e) {
    Loger.error(
      `css_dom.js [_buildTree] ${e},
        params[parent.id:${parent && parent.id},
        data.id:${data && data.id}]`,
    );
  }
  return cssNode;
};
// 主流程
const process = function(data: any) {
  // 构建树
  Loger.debug('render/h5/dom_css [_buildTree]');
  cssDomTree = _buildTree(null, data);

  Loger.debug('render/h5/dom_css [ReviseDomTree]');
  ReviseDomTree(cssDomTree);

  Loger.debug('render/h5/dom_css [TextRevise]');
  TextRevise(cssDomTree);
  return cssDomTree;
};
export default {
  CssDom,
  process,
  getCssString,
  getCssMap,
};
