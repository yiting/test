class TemplateData {
    constructor(o) {
        this.tag = o.tag || '';
        this.isCloseTag = o.isCloseTag;
        this.parentId = o.parentId;
        this.id = o.id;
        this.type = o.type;
        this.modelName = o.modelName;
        this.modelRef = o.modelRef;
        this.modelId = o.modelId;
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
        this.similarId = o.similarId;
        this.similarParentId = o.similarParentId;

        this.children = []; // 子节点储存
    }
    get width() {
        return this.abXops - this.abX;
    }
    get height() {
        return this.abYops - this.abY;
    }
}

module.exports = TemplateData