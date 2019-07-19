import Store from '../../helper/store';
import QLog from '../../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 构建xmlDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(data: any, parent: any) {
  let xmlNode: any;
  try {
    xmlNode = new Dom(data, parent);
    // 构建树
    if (parent) {
      parent.children.push(xmlNode);
    }
    data.children.forEach((child: any) => {
      _buildTree(child, xmlNode);
    });
  } catch (e) {
    Loger.error(
      `xml_dom.js [_buildTree] ${e},params[data.id:${data &&
        data.id},parent.id:${parent && parent.id}]`,
    );
  }
  return xmlNode;
}

class Dom {
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

  path: any;

  contrains: any;

  tplAttr: any;

  selfClassName: any;

  similarClassName: any;

  parent: any;

  styles: any;
  abXops: any;
  abYops: any;

  constructor(node: any, parentNode: any) {
    // super(node)
    this.children = [];
    this.parentNode = parentNode || null;
    this.id = node.id;
    this.modelId = node.modelId;
    this.modelName = node.modelName;
    this.tagName = node.tagName;
    this.isClosedTag = node.isClosedTag;
    this.text = node.text;
    this.abX = node.abX || 0;
    this.abY = node.abY || 0;
    this.abXops = node.abXops;
    this.abYops = node.abYops;
    this.path = node.path || null;
    this.contrains = node.contrains || {};
    this.tplAttr = node.tplAttr || {};
    this.styles = node.styles || {};
  }

  get x() {
    return this.parent ? this.abX - this.parent.abX : this.abX;
  }

  get y() {
    return this.parent ? this.abY - this.parent.abY : this.abY;
  }
  get width() {
    return this.abXops - this.abX;
  }

  get height() {
    return this.abYops - this.abY;
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
  getXmlStart() {
    const tag = this.getTag();
    const id = this.id ? `nid="${this.id}"` : '';
    const attrs = this.getAttrs();
    const content = this.getContent();
    const showTagAttrInfo = Store.get('showTagAttrInfo');
    if (showTagAttrInfo) {
      return `<${tag} ${id} ${attrs}>`;
    }
    return `<${tag} ${attrs}>`;
  }

  // 闭合节点
  getXmlEnd() {
    return this.isClosedTag ? '' : `</${this.getTag()}>`;
  }

  toJSON() {
    return {
      parentNodeId: this.parentNode && this.parentNode.id,
      id: this.id,
      children: this.children.map((node: any) => node.toJSON()),
      modelId: this.modelId,
      modelName: this.modelName,
      tagName: this.tagName,
      isClosedTag: this.isClosedTag,
      text: this.text,
      abX: this.abX,
      abY: this.abY,
      width: this.width,
      height: this.height,
      path: this.path,
      contrains: this.contrains,
      tplAttr: this.tplAttr,
      styles: this.styles,
    };
  }

  static getXmlString(xmlDom: any) {
    // 遍历循环
    let xml = xmlDom.getXmlStart();
    if (xmlDom.children) {
      xmlDom.children.forEach((child: any) => {
        xml += Dom.getXmlString(child);
      });
    }
    xml += xmlDom.getXmlEnd();
    return xml;
  }

  static process(data: any): any {
    Loger.debug('xml_dom.js [process]');
    return _buildTree(data, null);
  }
}

export default Dom;
