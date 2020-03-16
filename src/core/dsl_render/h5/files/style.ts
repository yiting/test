// 样式的计算处理
import QLog from '../../../dsl_helper/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);
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
    str = `${cssSelector} {${cssPropArr.join('')}}`;
  }
  return str;
}

export function getCssString(_cssDomTree: any, _similarData: any) {
  // 获取cssTree解析出的样式
  const css: any[] = []; // 每个CssDom节点返回的样式数组
  _parseCssTree(css, _cssDomTree, _similarData);
  return css.join('\n');
}
