import Store from '../../helper/store';
import QLog from '../../log/qlog';
import Constraints from '../../helper/constraints';
import PropertyMap from './propertyMap';
import VDom from '../vdom';

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 构建xmlDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(data: any, parent: any) {
  let xmlNode: any;
  try {
    xmlNode = new ArkDom(data, parent);
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

class ArkDom extends VDom {
  constructor(node: any, parent: any) {
    super(node, parent);

    // 根据映射定义属性
    PropertyMap.forEach((s: any) => {
      Object.defineProperty(this, s.key, {
        get: s.value,
      });
    });
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

  getPropertys() {
    const that: any = this;
    const props: any = [];
    PropertyMap.forEach((prop: any) => {
      const key = prop.key;
      const value = that[key];
      if (value !== null || value !== undefined) {
        const o: any = {};
        o[key] = value;
        props.push(`${key}="${value}"`);
      }
    });
    return props.join(' ');
  }

  // 开始节点
  getXmlStart() {
    const tag = this.getTag();
    const id = this.id ? `nid="${this.id}"` : '';
    const attrs = this.getAttrs();
    const props = this.getPropertys();
    // const content = this.getContent();
    const showTagAttrInfo = Store.get('showTagAttrInfo');
    if (showTagAttrInfo) {
      return `<${tag} ${id} ${attrs} ${props}>`;
    }
    return `<${tag} ${attrs} ${props}>`;
  }

  // 闭合节点
  getXmlEnd() {
    return this.isClosedTag ? '' : `</${this.getTag()}>`;
  }

  static getXmlString(xmlDom: any) {
    // 遍历循环
    let xml = xmlDom.getXmlStart();
    if (xmlDom.children) {
      xmlDom.children.forEach((child: any) => {
        xml += ArkDom.getXmlString(child);
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

export default ArkDom;