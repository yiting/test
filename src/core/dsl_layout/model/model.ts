import Utils from '../../dsl_helper/methods';

let serialId = 0;
class Model {
  _children: any[];
  _parent: any;
  _id: any;
  _type: any;
  _serialId: number;
  _similarId: number | null;
  _text: string | null;
  _abX: number;
  _abY: number;
  _abXops: number;
  _abYops: number;
  _styles: any;
  _path: string | null;
  _constraints: any;
  _zIndex: number;
  _name: string;
  _modelId: string;
  _canLeftFlex: boolean;
  _canRightFlex: boolean;
  __allowed_descendantIds: any;
  isMultiline: boolean;

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

    this.isMultiline = this.text
      ? this.height / (this.lineHeight || this.height) > 1.6
      : false;
  }
  static regular(node: any) {
    return false;
  }
  public get children() {
    return this._children;
  }
  public set children(value: any[]) {
    this._children = value;
  }
  public get parent() {
    return this._parent;
  }
  public set parent(value: any) {
    this._parent = value;
  }
  public get id() {
    return this._id;
  }
  public set id(value: any) {
    this._id = value;
  }
  public get type() {
    return this._type;
  }
  public set type(value: any) {
    this._type = value;
  }
  public get serialId() {
    return this._serialId;
  }
  public set serialId(value: number) {
    this._serialId = value;
  }
  public get similarId() {
    return this._similarId;
  }
  public set similarId(value: number | null) {
    this._similarId = value;
  }
  public get text() {
    return this._text;
  }
  public set text(value: string | null) {
    this._text = value;
  }
  public get abX() {
    return this._abX;
  }
  public set abX(value: number) {
    this._abX = value;
  }
  public get abY() {
    return this._abY;
  }
  public set abY(value: number) {
    this._abY = value;
  }
  public get abXops() {
    return this._abXops;
  }
  public set abXops(value: number) {
    this._abXops = value;
  }
  public get abYops() {
    return this._abYops;
  }
  public set abYops(value: number) {
    this._abYops = value;
  }
  public get styles() {
    return this._styles;
  }
  public set styles(value: any) {
    this._styles = value;
  }
  public get path() {
    return this._path;
  }
  public set path(value: string | null) {
    this._path = value;
  }
  public get constraints() {
    return this._constraints;
  }
  public set constraints(value: any) {
    this._constraints = value;
  }
  public get zIndex() {
    return this._zIndex;
  }
  public set zIndex(value: number) {
    this._zIndex = value;
  }
  public get name() {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
  public get modelId() {
    return this._modelId;
  }
  public set modelId(value: string) {
    this._modelId = value;
  }
  public get canLeftFlex() {
    return this._canLeftFlex;
  }
  public set canLeftFlex(value: boolean) {
    this._canLeftFlex = value;
  }
  public get canRightFlex() {
    return this._canRightFlex;
  }
  public set canRightFlex(value: boolean) {
    this._canRightFlex = value;
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

  get centerAbX() {
    return (this.abXops + this.abX) / 2;
  }
  get centerAbY() {
    return (this.abYops + this.abY) / 2;
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

  public appendChild(...childs: any) {
    childs.forEach((child: any) => {
      child.parent = this;
    });
    this.children.push(...childs);
  }

  public resetZIndex() {
    this.zIndex = this.children.length
      ? Math.min(...this.children.map(nd => nd.zIndex))
      : null;
  }
  public resize() {
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
  public exchangeModel(ModelClass: any) {
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
  public isSimilarWith(target: any): boolean {
    return this.similarId !== undefined && this.similarId === target.similarId;
  }
  static toJSON(node: any, deep: boolean) {
    let obj: any = {
      parentId: (node.parent && node.parent.id) || null,
      id: node.id,
      type: node.type,
      serialId: node.serialId,
      similarId: node.similarId,
      text: node.text,
      x: node.parent ? node.abX - node.parent.abX : node.abX,
      y: node.parent ? node.abY - node.parent.abY : node.abY,
      abX: node.abX,
      abY: node.abY,
      abXops: node.abXops,
      abYops: node.abYops,
      styles: node.styles,
      path: node.path,
      constraints: node.constraints,
      zIndex: node.zIndex,
      name: node.name,
      modelId: node.modelId,
      canLeftFlex: node.canLeftFlex,
      canRightFlex: node.canRightFlex,
      allowedDescendantIds: node.allowedDescendantIds,
      isMultiline: node.isMultiline,
      width: node.width,
      height: node.height,
      lineHeight: node.lineHeight,
      maxFontSize: node.maxFontSize,
      minFontSize: node.minFontSize,
    };
    if (deep) {
      obj.children = node.children.map((n: any) => {
        return Model.toJSON(n, deep);
      });
    }
    return obj;
  }
}
export default Model;
