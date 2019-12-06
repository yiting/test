import Store from '../../../helper/store';

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

  className: any;

  simClassName: any;

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
    this.className = node.className;
    this.simClassName = node.simClassName;
  }

  get x() {
    return this.parent ? this.abX - this.parent.abX : this.abX;
  }

  get y() {
    return this.parent ? this.abY - this.parent.abY : this.abY;
  }

  getAttrClass() {
    const result = [];
    if (this.className) {
      result.push(this.className);
    }
    if (this.simClassName) {
      result.push(this.simClassName);
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
}
export default HtmlDom;
