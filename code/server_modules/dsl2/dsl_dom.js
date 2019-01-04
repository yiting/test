let createDomIndex = 0;
class Dom {
    constructor(o, modelRoot) {
        // Object.assign(o, ...extend);
        this.id = o.id;
        this.similarMarkId = 0; // 相似模型标示
        this.modelRoot = modelRoot;// 模型根结点
        this.source = o.source || (!!o.id ? 'design' : null);
        this.name = o.name || '';
        this.styles = o.styles || {};
        this.texts = o.texts || (this.styles && this.styles.texts) || null;
        this.abX = o.abX || 0;
        this.abY = o.abY || 0;
        this.width = o.width || 0;
        this.height = o.height || 0;
        this.children = o.children || [];
        this.lines = 0; // 内容行数
        this.path = o.path || null;
        this.contrains = o.contrains || {};
        this.zIndex = o.zIndex; // 表现层级，值越高，展示越靠前
        this.parent = o.parent || null;
    }
    get x() {
        return this.parent ? (this.abX - this.parent.abX) : this.abX
    }
    get y() {
        return this.parent ? (this.abY - this.parent.abY) : this.abY
    }

}

module.exports = Dom;