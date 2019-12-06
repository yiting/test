import QLog from '../../log/qlog';
import HtmlDom from './model/html_dom';
const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 构建htmlDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(data: any, parent: any) {
  let htmlNode: any;
  try {
    htmlNode = new HtmlDom(data, parent);
    // 构建树
    if (parent) {
      parent.children.push(htmlNode);
    }
    data.children.forEach((child: any) => {
      _buildTree(child, htmlNode);
    });
  } catch (e) {
    Loger.error(
      `html_dom.js [_buildTree] ${e},params[data.id:${data &&
        data.id},parent.id:${parent && parent.id}]`,
    );
  }
  return htmlNode;
}

export function getHtmlString(htmlDom: any) {
  // 遍历循环
  let html = htmlDom.getHtmlStart();
  if (htmlDom.children) {
    htmlDom.children.forEach((child: any) => {
      html += getHtmlString(child);
    });
  }
  html += htmlDom.getHtmlEnd();
  return html;
}
export function process(
  data: any,
  cssDomTree: any,
  similarCssDomMap: any,
): any {
  return _buildTree(data, null);
}
