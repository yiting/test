/**
 * 创建空Dom
 */
const designDomAttrs = /^(id|model|type|name|abX|abY|x|y|width|height|children|contrains)$/;

let Contrain = require('./dsl_contrain.js');
let createDomIndex = 0;


class Dom {
    constructor(o) {
        this.id = o.id || (createDomIndex++);
        this.name = o.name || '';
        this.styles = o.styles || {};
        this.path = o.path || null;
        this.x = o.x || 0;
        this.y = o.y || 0;
        this.abX = o.abX || 0;
        this.abY = o.abY || 0;
        this.lines = 0;
        this.width = o.width || 0;
        this.height = o.height || 0;
        this.children = o.children || [];
        this.text = o.text || null;
        this.path = o.path || null;
        this.contrains = o.contrains || {};
        this.type = Dom.getType(this); // Dom基础类型
        this.layout = o.layout || ''; // 布局结构
        this.model = o.model || ''; // 模型
    }
    static getType(dom) {
        if (dom.text) {
            return Dom.type.TEXT;
        } else if (dom.children.length == 0 && (dom.path || (dom.styles && dom.styles.background))) {
            return Dom.type.IMAGE;
        } else {
            return Dom.type.LAYOUT;
        }
    }
    /* 
     * 合并节点
     * 原则：合并内容的关键属性不被合并
     */
    static assign(...doms) {
        let dom = doms.shift();
        while (doms.length) {
            let obj = doms.shift()
            for (var i in obj) {
                if (designDomAttrs.test(i)) {
                    continue;
                };
                if (!obj[i]) {
                    continue;
                }
                dom[i] = obj[i];
            }
        }
        return dom;
    }

    /**
     * 计算组高宽
     */
    static calRange(doms) {
        let o = {
            x: Number.POSITIVE_INFINITY,
            y: Number.POSITIVE_INFINITY,
            abX: Number.POSITIVE_INFINITY,
            abY: Number.POSITIVE_INFINITY,
            width: 0,
            height: 0
        }
        let right = 0,
            bottom = 0
        doms.forEach((d, i) => {
            o.x = d.x < o.x ? d.x : o.x;
            o.y = d.y < o.y ? d.y : o.y;
            o.abX = d.abX < o.abX ? d.abX : o.abX;
            o.abY = d.abY < o.abY ? d.abY : o.abY;
            right = right < (d.x + d.width) ? d.x + d.width : right;
            bottom = bottom < (d.y + d.height) ? d.y + d.height : bottom;
            // o.height = (o.y + o.height) < (d.y + d.height) ? (d.y + d.height - o.y) : o.height;
        });
        o.height = bottom - o.y;
        o.width = right - o.x;
        return o;
    }
    /**
     * 计算margin
     */
    static calMargin(cur, parentNode, dir) {
        let prev = parentNode.children[parentNode.children.indexOf(cur) - 1];
        let next = parentNode.children[parentNode.children.indexOf(cur) + 1];
        let direction = dir || (parentNode.contrains["LayoutPosition"] == Contrain.LayoutPosition.Horizontal && 'x') ||
            (parentNode.contrains["LayoutPosition"] == Contrain.LayoutPosition.Vertical && 'y') ||
            false;

        // 水平布局
        if (!parentNode) {
            return {};
        }
        let o = {};
        if (direction == 'x') {
            o["left"] = cur.x - (prev ? (prev.x + prev.width) : 0)
            o["right"] = (next ? next.x : parentNode.width) - cur.x - cur.width;
            o["top"] = cur.y;
            o["bottom"] = parentNode.height - cur.y - cur.height;
        } else if (direction == 'y') {
            o["top"] = cur.y - (prev ? (prev.y + prev.height) : 0)
            o["bottom"] = (next ? next.y : parentNode.height) - cur.y - cur.height;
            o["left"] = cur.x;
            o["right"] = parentNode.width - cur.x - cur.width;
        } else {
            o["left"] = cur.x;
            o["right"] = parentNode.width - cur.x - cur.width;
            o["top"] = cur.y;
            o["bottom"] = parentNode.height - cur.y - cur.height;
        }
        return o;
    }
    /**
     * 计算中心偏移
     */
    static calOffset(cur, parentNode, dir) {
        let prev = parentNode.children[parentNode.children.indexOf(cur) - 1];
        let next = parentNode.children[parentNode.children.indexOf(cur) + 1];
        let direction = dir || (parentNode.contrains["LayoutPosition"] == Contrain.LayoutPosition.Horizontal && 'x') ||
            (parentNode.contrains["LayoutPosition"] == Contrain.LayoutPosition.Vertical && 'y') ||
            false;
        // 水平布局
        if (!parentNode) {
            return {};
        }
        let o = {};
        if (direction == 'x') {
            o["left"] = cur.x + cur.width / 2 - (prev ? (prev.x + prev.width / 2) : 0)
            o["right"] = (next ? (next.x + next.width / 2) : parentNode.width) - cur.x - cur.width / 2;
            o["top"] = cur.y + cur.height / 2;
            o["bottom"] = parentNode.height - cur.y - cur.height / 2;
        } else if (direction == 'y') {
            o["top"] = cur.y + cur.height / 2 - (prev ? (prev.y + prev.height / 2) : 0)
            o["bottom"] = (next ? (next.y + next.height / 2) : parentNode.height) - cur.y - cur.height / 2;
            o["left"] = cur.x + cur.width / 2;
            o["right"] = parentNode.width - cur.x - cur.width / 2;
        } else {
            o["left"] = cur.x + cur.width / 2;
            o["right"] = parentNode.width - cur.x - cur.width / 2;
            o["top"] = cur.y + cur.height / 2;
            o["bottom"] = parentNode.height - cur.y - cur.height / 2;
        }
        return o;
    }
    /* 
        计算相对坐标
     */
    static calPosition(cur, parentNode) {
        let o = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        if (parentNode) {
            o.left = cur.x;
            o.top = cur.y;
            o.right = parentNode.width - cur.x - cur.width;
            o.bottom = parentNode.height - cur.y - cur.height
        }
        return o;
    }
    /* 
        是否包含
     */
    static isContain(domA, domB) {
        return domA.abX + domA.width >= domB.abX + domB.width &&
            domA.abY + domA.height >= domB.abY + domB.height &&
            domA.abX <= domB.abX &&
            domA.abY <= domB.abY
    }
    /* 
        是否水平
     */
    static isHorizontal(doms, errorCoefficient = 0) {
        let prev;
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        if (doms.length < 2) {
            return false;
        }
        return doms.every(meta => {
            if (!prev) {
                prev = meta;
                return true;
            }
            const meta_abY = meta.textAbY || meta.abY,
                prev_abY = prev.textAbY || prev.abY,
                meta_height = meta.textHeight || meta.height,
                prev_height = prev.textHeight || prev.height;

            let res = (meta_abY <= prev_abY + prev_height + errorCoefficient) &&
                (prev_abY <= meta_abY + meta_height + errorCoefficient);
            prev = meta;
            return res;
        })
    }
    static replaceWith(domA, parent, domB) {
        const index = parent.children.indexOf(domA);
        if (index < 0) {
            return false;
        }
        parent.children.splice(index, 1, domB);
    }

    /**
     * 是否垂直
     */
    static isVertical(arr, errorCoefficient = 0) {
        let prev;
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        return arr.every(dom => {
            if (!prev) {
                prev = dom;
                return true;
            }
            let res = dom.abX <= prev.abX + prev.width + errorCoefficient &&
                prev.abX <= dom.abX + dom.width + errorCoefficient;
            prev = dom;
            return res;
        })
    }
    static isSameModel(doms) {
        if (doms.length < 2) {
            return false;
        }
        const model = doms[0].model;
        return doms.every(d => d.model == model);
    }
    static isSameType(doms) {
        if (doms.length < 2) {
            return false;
        }
        const type = doms[0].type;
        return doms.every(d => d.type == type);

    }
    static isCenter(dom, parent, errorCoefficient = 3) {
        let offset = Dom.calOffset(dom, parent, undefined);
        return Math.abs(offset.left - offset.right) <= errorCoefficient * 3;
    }
    static isMiddle(dom, parent, errorCoefficient = 3) {
        let offset = Dom.calOffset(dom, parent, undefined);
        return Math.abs(offset.top - offset.bottom) <= errorCoefficient * 3;
    }
}
Dom.type = {
    TEXT: "text",
    IMAGE: "image",
    LAYOUT: "layout"
}

Dom.layout = {
    BLOCK: 'block', // 组织
    COLUMN: 'column', // 列
    ROW: 'row', // 行
    INLINE: 'inline', // 行内
}
// 对齐方式
Dom.align = {
    "left": 0,
    "right": 1,
    "center": 2
}

Dom.fontWeight = {
    "thin": 100, //Thin
    "extra": 200, //Extra Light (Ultra Light)
    "light": 300, //Light
    "regular": 400, //Regular (Normal、Book、Roman)
    "medium": 500, //Medium
    "semibold": 600, //Semi Bold (Demi Bold)
    "bold": 700, //Bold
    "extra": 800, //Extra Bold (Ultra Bold)
    "black": 900, //Black (Heavy)
}
module.exports = Dom;