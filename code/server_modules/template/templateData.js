class TemplateData {
    constructor(o = {}, parent, modelData) {
        this.tagName = o.tagName || '';
        this.serialId = TemplateData.index++;
        this.isClosedTag = o.isClosedTag;
        this.parentId = o.parentId || (parent && parent.id) || null;
        this.parent = o.parent || parent;
        this.id = o.id || this.serialId;
        this.type = o.type;
        this.modelName = o.modelName;
        this.modelRef = o.modelRef;
        this.modelId = o.id == modelData.id ? null : modelData.id;
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
    }
    get width() {
        return this.abXops - this.abX;
    }
    get height() {
        return this.abYops - this.abY;
    }

    resize() {
        let nodes = this.children;
        if (!nodes.length) {
            return;
        }
        let o = {
            abX: Number.POSITIVE_INFINITY,
            abY: Number.POSITIVE_INFINITY,
            abXops: Number.NEGATIVE_INFINITY,
            abYops: Number.NEGATIVE_INFINITY
        }
        nodes.forEach((d, i) => {
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


    static reset() {
        TemplateData.index = 0;
    }
}
TemplateData.index = 0;

module.exports = TemplateData