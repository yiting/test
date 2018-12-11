/**
 * 创建空Dom
 */
const designDomAttrs = /^(id|model|type|name|abX|abY|x|y|styles|width|height|children|contrains)$/;

let Contrain = require('./dsl_contrain.js');
let StyleDom = require('./dsl_styledom.js');
let createDomIndex = 0;


class Dom {
    constructor(o, ...extend) {
        Object.assign(o, ...extend);
        this.id = o.id || (createDomIndex++);
        this.source = o.source || (!!o.id ? 'design' : null);
        this.name = o.name || '';
        this.texts = o.styles && o.styles.texts || null;
        this.styles = new StyleDom(o.styles);
        this.x = o.x || 0;
        this.y = o.y || 0;
        this.abX = o.abX || 0;
        this.abY = o.abY || 0;
        this.width = o.width || 0;
        this.height = o.height || 0;
        this.children = o.children || [];
        this.text = o.text || null;
        this.lines = 0; // 内容行数
        this.path = o.path || null;
        this.contrains = o.contrains || {};
        this.type = Dom.getType(this); // Dom基础类型
        this.layout = o.layout || ''; // 布局描述
        this.model = o.model || null; // 模型对象
        this.isRoot = o.isRoot || false; // 是否跟节点
        this.similarMarkId = -1; // 相似模型标示
        this.zIndex = o.zIndex; // 表现层级，值越高，展示越靠前
    }
    static getType(dom) {
        if (dom.text) {
            return Dom.type.TEXT;
            // } else if (dom.children.length == 0 && (dom.path || (dom.styles && dom.styles.background))) {
        } else if (dom.children.length == 0 && dom.path) {
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
        if (!doms) {
            return {};
        }
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
        });
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
            let res = dom.abX < prev.abX + prev.width + errorCoefficient &&
                prev.abX < dom.abX + dom.width + errorCoefficient;
            prev = dom;
            return res;
        })
    }
    static horizontalLogic(a, b, errorCoefficient) {
        if (
            // 如果水平方向相连
            Dom.isXConnect(a, b, errorCoefficient) &&
            // 如果垂直不包含
            !Dom.isYWrap(a, b)) {
            return false;
        }

        // return (a_abY < b_abY + b_height + errorCoefficient) &&
        // (b_abY < a_abY + a_height + errorCoefficient);
        return Dom.isYConnect(a, b, errorCoefficient);
    }
    /**
     * 是否水平
     * logic：若垂直方向不相交，则水平方向相交为水平
     * 若垂直方向相交，则水平方向互相包含则水平
     * 当doms数量只有一个,返回true
     */
    static isHorizontal(doms, errorCoefficient = 0) {
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        return doms.every((a, i) => {
            return doms.every((b, j) => {
                return j <= i || Dom.horizontalLogic(a, b, errorCoefficient)
            })
        })
    }
    /**
     * 节点替换
     * @param {Dom} domA 被替换节点
     * @param {Dom} parent 被替换节点父节点
     * @param {Dom} domB 替换节点
     */
    static replaceWith(domA, parent, domB) {
        if (parent.children.includes(domA)) {
            // 替换节点索引
            const domBIndex = parent.children.indexOf(domB);
            if (domBIndex > -1) {
                parent.children.splice(domBIndex, 1);
            }
            const domAIndex = parent.children.indexOf(domA);
            parent.children.splice(domAIndex, 1, domB);
        }
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
    static isXCenter(dom, parent, errorCoefficient = 3) {
        let offset = Dom.calOffset(dom, parent, undefined);
        return Math.abs(offset.left - offset.right) <= errorCoefficient * 3;
    }
    static isYCenter(dom, parent, errorCoefficient = 3) {
        let offset = Dom.calOffset(dom, parent, undefined);
        return Math.abs(offset.top - offset.bottom) <= errorCoefficient * 3;
    }
    static isCenter(dom, parent, errorCoefficient = 3) {
        let offset = Dom.calOffset(dom, parent, undefined);
        return Math.abs(offset.left - offset.right) <= errorCoefficient * 3 &&
            Math.abs(offset.top - offset.bottom) <= errorCoefficient * 3;
    }
    static isXConnect(a, b, dir = 0) {
        const aCx = a.abX + a.width / 2,
            bCx = b.abX + b.width / 2;
        return Math.abs(aCx - bCx) <= (a.width + b.width) / 2 + dir;
    }
    static isYConnect(a, b, dir = 0) {
        const aCy = a.abY + a.height / 2,
            bCy = b.abY + b.height / 2;
        return Math.abs(aCy - bCy) <= (a.height + b.height) / 2 + dir;
    }
    /**
     * 判断相连, 
     * @param {Dom} a a
     * @param {Dom} b b
     * @param {Dom} dir 间距
     */
    static isConnect(a, b, dir = 0) {
        return Dom.isXConnect(a, b, dir) &&
            Dom.isYConnect(a, b, dir);
    }
    static isXOn(outer, inner, dir = 0) {
        return outer.abX + outer.width >= inner.abX + inner.width / 2 &&
            outer.abX <= inner.abX + inner.width / 2
    }
    static isYOn(outer, inner, dir = 0) {
        return outer.abY + outer.height >= inner.abY + inner.height / 2 &&
            outer.abY <= inner.abY + inner.height / 2
    }
    static isYWrap(a, b) {
        const a_abY = a.textAbY || a.abY,
            b_abY = b.textAbY || b.abY,
            a_height = a.textHeight || a.height,
            b_height = b.textHeight || b.height
        return Math.abs(a_abY + a_height / 2 - b_abY - b_height / 2) <=
            Math.abs(a_height - b_height) / 2
    }
    static isXWrap(a, b) {
        return Math.abs(a.abX + a.width / 2 - b.abX - b.width / 2) <=
            Math.abs(a.width - b.width) / 2
    }
    /* static isXWrap(outer, inner) {
        return outer.abX + outer.width >= inner.abX + inner.width &&
            outer.abX <= inner.abX

    }
    static isYWrap(outer, inner) {
        return outer.abY + outer.height >= inner.abY + inner.height &&
            outer.abY <= inner.abY;
    } */
    /**
     * 判断完全包含， inner边界在outer内
     * @param {Dom} outer 外
     * @param {Dom} inner 内
     */
    static isWrap(outer, inner) {
        return Dom.isXWrap(outer, inner) && Dom.isYWrap(outer, inner);
    }
    /**
     * 行高清洗
     * @param {Dom} dom dom
     * @param {Dom} lineHeightCoe 行高系数，如1.1
     */
    static cleanLineHeight(dom, lineHeightCoe) {
        if (!dom.lines && dom.text && (dom.texts || dom.styles.texts)) {
            // fontSize
            let maxSize = Number.NEGATIVE_INFINITY,
                minSize = Number.POSITIVE_INFINITY;
            (dom.texts || dom.styles.texts).forEach((s) => {
                maxSize = s.size > maxSize ? s.size : maxSize;
                minSize = s.size < minSize ? s.size : minSize;
            });
            dom.styles.maxSize = Math.round(maxSize);
            dom.styles.minSize = Math.round(minSize);
            // 当前真实行高
            const lineHeight = dom.styles.lineHeight || maxSize * 1.4;
            // 目标行高
            const targetLineHeight = maxSize * lineHeightCoe;
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
module.exports = Dom;