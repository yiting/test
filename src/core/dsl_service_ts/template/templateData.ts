import { debug } from 'util';

class TemplateData {
  static index: any;

  tagName: any; // 标签名

  serialId: any; // 节点序列号

  isClosedTag: any; // 是否闭合

  parentId: any; // 父节点Id

  parent: any; // 父节点

  id: any;

  type: any; // 节点类型

  modelName: any; // 模型名称

  modelRef: any; // 模型索引值

  modelId: any; // 模型Id

  abX: any;

  abY: any;

  abXops: any;

  abYops: any;

  canLeftFlex: any;

  canRightFlex: any;

  constraints: any;

  zIndex: any;

  text: any;

  path: any;

  styles: any;

  similarId: any; // 相似序列号

  similarParentId: any; // 相似父节点

  tplAttr: any; // 模板属性

  children: any[];
  isMultiline: boolean;

  constructor(o: any = {}, parent: any | null, modelData: any) {
    this.tagName = o.tagName || '';
    this.serialId = TemplateData.index.toString();
    this.isClosedTag = o.isClosedTag;
    this.parentId = o.parentId || (parent && parent.id) || null;
    this.parent = parent;
    this.id = o.id || this.serialId;
    this.type = o.type;
    this.modelName = o.constructor.name;
    this.modelRef = o.modelRef;
    this.modelId = o.id === modelData.id ? null : modelData.id;
    this.abX = o.abX;
    this.abY = o.abY;
    this.abXops = o.abXops;
    this.abYops = o.abYops;
    this.canLeftFlex = o.canLeftFlex;
    this.canRightFlex = o.canRightFlex;
    this.constraints = o.constraints || {};
    this.zIndex = o.zIndex;
    this.text = o.text;
    this.path = o.path;
    this.styles = o.styles || {};
    this.tplAttr = o.tplAttr || {};
    this.similarId = o.similarId;
    this.similarParentId = o.similarParentId;
    this.children = []; // 子节点储存
    TemplateData.index += 1;
  }

  get width() {
    return this.abXops - this.abX;
  }

  get height() {
    return this.abYops - this.abY;
  }
  relay() {
    if (this.parent) {
      this.abX = this.abX || this.parent.abX;
      this.abY = this.abY || this.parent.abY;
      this.abXops = this.abXops || this.parent.abXops;
      this.abYops = this.abYops || this.parent.abYops;
      this.canLeftFlex = this.canLeftFlex || this.parent.canLeftFlex;
      this.canRightFlex = this.canRightFlex || this.parent.canRightFlex;
      this.constraints = this.constraints || this.parent.constraints;
      this.zIndex = this.zIndex || this.parent.zIndex;
      this.text = this.text || this.parent.text;
      this.path = this.path || this.parent.path;
      this.styles = this.styles || this.parent.styles;
    }
  }
  resize() {
    const nodes = this.children;
    if (!nodes.length) {
      return;
    }
    const o = {
      abX: Number.POSITIVE_INFINITY,
      abY: Number.POSITIVE_INFINITY,
      abXops: Number.NEGATIVE_INFINITY,
      abYops: Number.NEGATIVE_INFINITY,
    };
    nodes.forEach((d: any, i: any) => {
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      o.abXops = d.abXops > o.abXops ? d.abXops : o.abXops;
      o.abYops = d.abYops > o.abYops ? d.abYops : o.abYops;
    });
    this.abX = o.abX;
    this.abY = o.abY;
    this.abXops = o.abXops;
    this.abYops = o.abYops;
  }

  static reset(): any {
    TemplateData.index = 0;
  }
}
TemplateData.index = 0;

export default TemplateData;
