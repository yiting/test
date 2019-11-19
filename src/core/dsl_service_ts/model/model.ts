import Utils from '../helper/methods';
import Dictionary from '../helper/dictionary';

let serialId = 0;
class Model {
  children: any[];
  parent: any;
  id: any;
  type: any;
  serialId: number;
  similarId: number | null;
  text: string | null;
  abX: number;
  abY: number;
  abXops: number;
  abYops: number;
  styles: any;
  path: string | null;
  constraints: any;
  zIndex: number;
  name: string;
  modelId: string;
  canLeftFlex: boolean;
  canRightFlex: boolean;
  __allowed_descendantIds: any;

  static resetSerialId() {
    serialId = 0;
  }

  constructor(node: any = {}) {
    this.children = [];
    this.parent = node.parent || null;
    this.id = node.id || serialId.toString();
    this.type = node.type;
    this.serialId = serialId++;
    this.similarId = node.similarId || null;
    // 模型Id，默认为节点Id
    this.modelId = node.id; //
    this.text = node.text;
    this.abX = node.abX || 0;
    this.abY = node.abY || 0;
    this.abXops = node.abXops || node.abX + node.width;
    this.abYops = node.abYops || node.abY + node.height;
    this.path = node.path || null;
    this.zIndex = node.zIndex;
    this.styles = node.styles || {};
    this.constraints = node.constraints || {};
    this.canLeftFlex = node.canLeftFlex || false;
    this.canRightFlex = node.canRightFlex || false;
    this.__allowed_descendantIds = node._allowed_descendantIds || null;
  }
  static regular(node: any) {
    return false;
  }

  appendChild(...childs: any) {
    childs.forEach((child: any) => {
      child.parent = this;
    });
    this.children.push(...childs);
  }

  toJSON() {
    return {
      children: this.children.map((node: any) => node.toJSON()),
      parentId: this.parent && this.parent.id,
      id: this.id,
      type: this.type,
      serialId: this.serialId,
      similarId: this.similarId,
      canLeftFlex: this.canLeftFlex,
      canRightFlex: this.canRightFlex,
      text: this.text,
      abX: this.abX,
      abY: this.abY,
      abXops: this.abXops,
      abYops: this.abYops,
      path: this.path,
      zIndex: this.zIndex,
      isMultiline: this.isMultiline,
      styles: this.styles,
      constraints: this.constraints,
    };
  }

  resetZIndex() {
    this.zIndex = this.children.length
      ? Math.min(...this.children.map(nd => nd.zIndex))
      : null;
  }
  resize() {
    if (this.type !== Dictionary.type.QLayer) {
      return;
    }
    let notAbsChildren = Utils.filterAbsNode(this.children);
    let { abX, abY, abXops, abYops } = Utils.calRange(notAbsChildren);
    Object.assign(this, {
      abX,
      abY,
      abXops,
      abYops,
    });
    return this;
  }
  get _allowed_descendantIds() {
    return (
      this.__allowed_descendantIds ||
      (this.parent && this.parent._allowed_descendantIds) ||
      null
    );
  }
  get maxFontSize() {
    if (this.styles.texts) {
      return Math.max(...this.styles.texts.map((word: any) => word.size));
    }
    return null;
  }

  get minFontSize() {
    if (this.styles.texts) {
      return Math.min(...this.styles.texts.map((word: any) => word.size));
    }
    return null;
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

  get lineHeight() {
    if (this.styles.texts) {
      return Math.max(...this.styles.texts.map((word: any) => word.lineHeight));
    }
    return null;
  }

  get isMultiline() {
    if (this.text) {
      return this.height / this.lineHeight > 1.6;
    }
    return null;
  }
  exchangeModel(ModelClass: any) {
    var newData = new ModelClass(this);
    newData.children = this.children;
    newData.children.forEach((child: any) => {
      child.parent = newData;
    });
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index > -1) {
        this.parent.children.splice(index, 1, newData);
      }
    }
    return newData;
  }
}
export default Model;
