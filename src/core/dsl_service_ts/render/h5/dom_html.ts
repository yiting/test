import Store from '../../helper/store';
import QLog from '../../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

let _cssDomMap: any;
let _similarCssDomMap: any;

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

class HtmlDom {
  children: any[];

  parentNode: any;

  id: any;

  serialId: any;

  similarId: any;

  modelId: any;

  modelName: any;

  tagName: any;

  isClosedTag: any;

  text: any;

  abX: any;

  abY: any;

  width: any;

  height: any;

  path: any;

  contrains: any;

  tplAttr: any;

  selfClassName: any;

  similarClassName: any;

  parent: any;

  styles: any;

  constructor(node: any, parentNode: any) {
    // super(node)
    this.children = [];
    this.parentNode = parentNode || null;
    this.id = node.id;
    this.serialId = node.serialId;
    this.similarId = node.similarId;
    this.modelId = node.modelId;
    this.modelName = node.modelName;
    this.tagName = node.tagName;
    this.isClosedTag = node.isClosedTag;
    this.text = node.text;
    this.abX = node.abX || 0;
    this.abY = node.abY || 0;
    this.width = node.width || 0;
    this.height = node.height || 0;
    this.path = node.path || null;
    this.contrains = node.contrains || {};
    this.tplAttr = node.tplAttr || {};
    this.styles = node.styles || {};
    this.selfClassName = node.selfClassName;
    this.similarClassName = node.similarClassName;
  }

  get x() {
    return this.parent ? this.abX - this.parent.abX : this.abX;
  }

  get y() {
    return this.parent ? this.abY - this.parent.abY : this.abY;
  }

  getAttrClass() {
    const result = [];
    const _cssDom = _cssDomMap[this.id];
    const _simCssDom = _similarCssDomMap[this.similarId];
    if (
      _cssDom.getCss(_simCssDom && _simCssDom.css) ||
      // 如果有子节点，为避免自节点样式链断了，保留当前节点样式名
      this.children.length > 0
    ) {
      result.push(this.selfClassName);
    }
    if (this.similarClassName && this.similarClassName !== this.selfClassName) {
      result.push(this.similarClassName);
    }

    if (result.length) {
      return `class="${result.join(' ')}"`;
    }
    return '';
  }

  getTag() {
    return this.tagName || 'div';
  }

  getContent() {
    return (
      (this.styles.texts &&
        this.styles.texts[0] &&
        this.styles.texts[0].string) ||
      ''
    );
  }

  getAttrs() {
    const result = [];
    if (this.tplAttr) {
      result.push(
        ...Object.keys(this.tplAttr).map((key: string) => {
          if (key !== 'data-model' && key !== 'class') {
            return `${key}="${this.tplAttr[key]}"`;
          }
          return undefined;
        }),
      );
    }
    return result.join(' ');
  }

  // 开始节点
  getHtmlStart() {
    const modelName = this.modelName ? `md="${this.modelName}"` : '';
    const tag = this.getTag();
    const id = this.id ? `nid="${this.id}"` : '';
    const similarId = this.similarId ? `sim=${this.similarId}` : '';
    const attrClass = this.getAttrClass();
    const attrs = this.getAttrs();
    const content = this.getContent();
    const showTagAttrInfo = Store.get('showTagAttrInfo');
    if (!this.id) {
      debugger;
    }
    const isSource = !~this.id.indexOf('layer') ? 'isSource' : '';
    if (showTagAttrInfo) {
      return `<${tag} ${id} ${similarId} ${isSource} ${modelName} ${attrClass} ${attrs}>${content}`;
    }
    return `<${tag} ${attrClass} ${attrs}>${content}`;
  }

  // 闭合节点
  getHtmlEnd() {
    return this.isClosedTag ? '' : `</${this.getTag()}>`;
  }

  static getHtmlString(htmlDom: any) {
    // 遍历循环
    let html = htmlDom.getHtmlStart();
    try {
      if (htmlDom.children) {
        htmlDom.children.forEach((child: any) => {
          html += HtmlDom.getHtmlString(child);
        });
      }
      html += htmlDom.getHtmlEnd();
    } catch (e) {
      debugger;
    }
    return html;
  }

  static process(data: any, cssDomMap: any, similarCssDomMap: any): any {
    Loger.debug('html_dom.js [process]');
    _cssDomMap = cssDomMap;
    _similarCssDomMap = similarCssDomMap;
    Loger.debug('html_dom.js [_buildTree]');
    return _buildTree(data, null);
  }
}

export default HtmlDom;
