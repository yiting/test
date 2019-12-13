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
const _parseCssTree = function(arr: any[], dom: any, similarData: any) {
  try {
    const similarCss =
      similarData[dom.similarId] && similarData[dom.similarId].css;
    const str = getCss(dom, similarCss);
    if (str) {
      arr.push(str);
    }
    dom.children.forEach((child: any) => {
      _parseCssTree(arr, child, similarData);
    });
  } catch (e) {
    Loger.error(
      `css_dom.js [_parseCssTree] ${e},params[dom.id:${dom && dom.id}]`,
    );
  }
};

/**
 * 获取该节点的样式
 */
function getCss(cssDom: any, similarCss: any) {
  let str = '';
  const cssSelector = cssDom.getCssSelector();
  const cssPropArr = cssDom.getCssProperty(similarCss);
  if (cssPropArr.length) {
    str = `${cssSelector} {${cssPropArr.join(';')}}`;
  }
  return str;
}

/**
 * 构建cssDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(parent: any, data: any) {
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
}

export function getCssString(_cssDomTree: any, _similarData: any) {
  // 获取cssTree解析出的样式
  const css: any[] = []; // 每个CssDom节点返回的样式数组
  // css_combo_extend_tree.countCombo(_cssDomTree);
  _parseCssTree(css, _cssDomTree, _similarData);
  return css.join('\n');
}
// 主流程
export function process(data: any) {
  // 构建树
  Loger.debug('render/h5/dom_css [_buildTree]');
  cssDomTree = _buildTree(null, data);

  Loger.debug('render/h5/dom_css [ReviseDomTree]');
  ReviseDomTree(cssDomTree);

  Loger.debug('render/h5/dom_css [TextRevise]');
  TextRevise(cssDomTree);
  return cssDomTree;
}
