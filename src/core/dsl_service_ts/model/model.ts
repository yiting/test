import utils from '../helper/uitls';

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
  }
  static regular(node: any) {
    return true;
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
    const { abX, abY, height, width } = utils.getRange(this.children);
    const abXops = abX + width;
    const abYops = abY + height;
    Object.assign(this, {
      abX,
      abY,
      abXops,
      abYops,
    });
    return this;
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
  static exchange(ModelClass: any, data: any) {
    var newData = new ModelClass(data);
    newData.children = data.children;
    newData.children.forEach((child: any) => {
      child.parent = newData;
    });
    if (data.parent) {
      const index = data.parent.children.indexOf(data);
      data.parent.children.splice(index, 1, newData);
    }
    return newData;
  }
}
export default Model;
