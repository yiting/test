/**
 * 创建空Dom
 */
const designDomAttrs = /^(id|model|type|name|abX|abY|x|y|styles|width|height|children|contrains)$/;

let Contrain = require('./dsl_contrain.js');
let createDomIndex = 0;


class Dom {
    constructor(o, ...extend) {
        Object.assign(o, ...extend);
        this.id = o.id || (createDomIndex++);
        this.isSource = !!o.id;
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
        this.isRoot = o.isRoot || false;
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
            let obj = doms.shift();
            for (var s in obj.styles) {
                if (!obj.styles[s]) {
                    continue
                }
                dom.styles[s] = obj.styles[s]
            }
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
            let height = d.height
            o.x = d.x < o.x ? d.x : o.x;
            o.y = d.y < o.y ? d.y : o.y;
            o.abX = d.abX < o.abX ? d.abX : o.abX;
            o.abY = d.abY < o.abY ? d.abY : o.abY;
            right = right < (d.abX + d.width) ? (d.abX + d.width) : right;
            bottom = bottom < (d.abY + d.height) ? (d.abY + d.height) : bottom;
            // console.log(d.abX+d.width,d.abY+d.height);
        });
        // console.log(o)
        o.height = bottom - o.abY;
        o.width = right - o.abX;
        return o;
    }
    static findPrevDom(dom, parentNode) {
        if (!parentNode) {
            return null;
        }
        let res;
        parentNode.children.some((child => {
            if (child != dom && child.contrains["LayoutSelfPosition"] != Contrain.LayoutSelfPosition.Absolute) {
                res = child;
            }
            return child == dom;
        }))
        return res;
    }
    static findNextDom(dom, parentNode) {
        if (!parentNode) {
            return null;
        }
        let res;
        parentNode.children.reverse().some(((child, i) => {
            if (child != dom && child.contrains["LayoutSelfPosition"] != Contrain.LayoutSelfPosition.Absolute) {
                res = child;
            }
            return child == dom;
        }));
        parentNode.children.reverse();
        return res;
    }
    /**
     * 计算margin
     */
    static calMargin(cur, parentNode, dir) {
        let direction = dir || (parentNode.contrains["LayoutDirection"] == Contrain.LayoutDirection.Horizontal && 'x') ||
            (parentNode.contrains["LayoutDirection"] == Contrain.LayoutDirection.Vertical && 'y') ||
            false;
        let prev, next

        // 水平布局
        if (!parentNode) {
            return {};
        }
        if (direction) {
            // let prev = parentNode.children[parentNode.children.indexOf(cur) - 1];
            // let next = parentNode.children[parentNode.children.indexOf(cur) + 1];
            prev = Dom.findPrevDom(cur, parentNode)
            next = Dom.findNextDom(cur, parentNode)
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
        let direction = dir || (parentNode.contrains["LayoutDirection"] == Contrain.LayoutDirection.Horizontal && 'x') ||
            (parentNode.contrains["LayoutDirection"] == Contrain.LayoutDirection.Vertical && 'y') ||
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
    /**
     * 是否水平
     * 当doms数量只有一个,返回true
     */
    static isHorizontal(doms, errorCoefficient = 0) {
        let prev;
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        return doms.every(meta => {
            if (!prev) {
                prev = meta;
                return true;
            }
            const meta_abY = meta.textAbY || meta.abY,
                prev_abY = prev.textAbY || prev.abY,
                meta_height = meta.textHeight || meta.height,
                prev_height = prev.textHeight || prev.height,
                meta_centerX = meta.abX + meta.width / 2,
                prev_centerX = prev.abX + prev.width / 2

            let res = (meta_centerX < prev.abX && prev_centerX > (meta.abX + meta.width) ||
                    prev_centerX < meta.abX && meta_centerX > (prev.abX + prev.width)) &&
                (meta_abY <= prev_abY + prev_height + errorCoefficient) &&
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
     * 当doms数量只有一个,返回true
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
    static cleanLineHeight(dom,lineHeightCoe) {
        if (dom.text) {
            // fontSize
            let maxSize = Number.NEGATIVE_INFINITY,
                minSize = Number.POSITIVE_INFINITY
            dom.styles.texts.forEach((s) => {
                maxSize = s.size > maxSize ? s.size : maxSize;
                minSize = s.size < minSize ? s.size : minSize;
            });
            dom.styles.maxSize = Math.round(maxSize);
            dom.styles.minSize = Math.round(minSize);
            // 当前真实行高
            const lineHeight = dom.styles.lineHeight || maxSize * 1.4;
            // 目标行高
            const targetLineHeight = maxSize * lineHeightCoe
            // 根据高度处以行高，如果多行，则不处理行高
            if (dom.height / lineHeight > 1.1) {
                dom.lines = Math.round(dom.height / lineHeight);
                return;
            }
            dom.lines = 1;
            // 当前行高差
            let dir = (lineHeight - maxSize);
            dom.textHeight = Math.round(maxSize);
            dom.textAbY = Math.round(dom.abY + dir / 2);
            // 设置目标行高、高度、Y
            let dif = Math.floor((targetLineHeight - dom.height) / 2);
            dom.height = dom.styles.lineHeight = Math.round(targetLineHeight);
            dom.y -= dif;
            dom.abY -= dif;
        }
    }
}
Dom.type = {
    TEXT: "text",
    IMAGE: "image",
    LAYOUT: "layout"
}

Dom.layout = {
    // DEFAULT: 'default', // 原生默认
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