let Common = require("./dsl_common.js");
let Store = require("./dsl_store.js");
/**
 * 模型分析+处理
 */
function fn(dom) {
    if (dom.children) {
        dom.children.forEach((child, i) => {
            fn(child);
            child.styleAuto = {};
            txtContain(child, dom) ||
                image(child) ||
                text(child) ||
                paragraph(child) ||
                tag(child) ||
                iconEnter(child) ||
                inline(child) ||
                txtButton(child) ||
                label(child) ||
                block(child)
        });
    }
    return dom;
}
/**
 * 头部导航栏
 * @return {[type]} [description]
 */
function appStateNav(dom) {

}
/**
 * banner
 */
function banner(dom) {
    if (
        (dom.width / Config.device.width > Option.bannerCoefficient) &&
        dom.path

    ) {

    }
}

function inline(dom) {
    if (dom.type === Store.type.INLINE) {
        dom.styleAuto["width"] = true;
    }
}
/**
 * 聚合
 */
function block(dom) {
    if (dom.type == Store.type.BLOCK) {
        let paddingLeft = dom.x;
        dom.styleAuto["height"] = true;
        dom.x = 0;
        dom.abX = 0;
        dom.width = Config.page.width;
        dom.children.forEach((child, i) => {
            child.x += paddingLeft;
            child.abX += paddingLeft;
        });
        return true;
    }
}

function image(dom) {
    if (!dom.text && dom.path && (!dom.children || dom.children.length == 0)) {
        dom.type = Store.type.IMAGE;
        return true;
    }
}
/**
 * 文本
 */
function text(dom) {
    if (dom.text && !dom.path && dom.lines == 1) {
        dom.type = Store.type.TEXT;
        dom.styleAuto["width"] = true;
        dom.styleAuto["height"] = true;
        return true;
    }
}

/**
 * 段落
 */
function paragraph(dom) {
    if (dom.text && dom.lines > 1 && (!dom.children || dom.children.length == 0)) {
        dom.type = Store.type.PARAGRAPH;
        dom.styleAuto["height"] = true;
        return true;
    }
}
/**
 * 图标入口
 */
function iconEnter(dom) {
    if (dom.children && dom.children.length == 2) {
        const txt = dom.children.find((child) => {
            return child.type == Store.type.TEXT;
        });
        const img = dom.children.find((child) => {
            return child.type == Store.type.IMAGE;
        });
        if (txt && img && img.abY + img.height < txt.abY) {
            dom.type = Store.type.ICONENTER;
        }
        return true;
    }
}
/**
 * 图标标签
 */
function label(dom) {
    if (dom.children && dom.children.length == 2) {
        const txt = dom.children.find((child) => {
            return child.type == Store.type.TEXT;
        });
        const img = dom.children.find((child) => {
            return child.type == Store.type.IMAGE;
        });
        if (txt && img &&
            Math.abs(img.height - txt.height) < txt.minSize &&
            (img.abX + img.width < txt.abX)
        ) {
            dom.type = Store.type.LABEL;
        }
        return true;
    }
}

/**
 * 
 * 规则：
 */
function txtContain(dom, parent) {
    if (dom.text && dom.children && dom.children.length > 0) {
        let child = Common.createDom({
            type: Store.type.TEXT,
            x: dom.x,
            y: dom.y,
            width: dom.width,
            height: dom.height,
            abX: dom.abX,
            abY: dom.abY,
            children: [dom].concat(dom.children)
        });
        dom.children = [];
        dom.x = 0;
        dom.y = 0;
        parent.children.some((item, i) => {
            if (item == dom) {
                parent.children[i] = child;
                return true;
            }
        });
        return true;
    }
}
/**
 * 文本按钮
 * 规则：内容只有一行文案且内容水平、垂直居中
 */
function txtButton(dom) {
    if (dom.children && dom.children.length == 1 &&
        dom.children[0].text &&
        dom.children[0].lines == 1) {
        // Text和Parent中心点
        let child = dom.children[0];
        let vx = child.x + child.width / 2,
            vy = child.y + child.height / 2,
            px = dom.width / 2,
            py = dom.height / 2;

        // 如果中心点偏移小于2
        if (dom.height / child.height < 3 &&
            Math.abs(vx - px) < 2 &&
            Math.abs(vy - py) < 2) {
            child.lineHeight = dom.height;
            child.textAlign = "center";
            dom.type = Store.type.BUTTON;
            Common.assign(dom, child);
            dom.children = [];
            return true;
        }
    }
}

/**
 * 文本标签
 * 规则：内容只有一行文案且内容水平、垂直居中
 */
function tag(dom) {
    if (dom.children && dom.children.length == 1 &&
        dom.children[0].text &&
        dom.children[0].lines == 1) {
        // Text和Parent中心点
        let child = dom.children[0],
            maxSize = 0;
        child.styles.texts.forEach((t, i) => {
            maxSize = maxSize < t.size ? t.size : maxSize;
        });
        let vx = child.x + child.width / 2,
            vy = child.y + child.height / 2,
            px = dom.width / 2,
            py = dom.height / 2,
            padding = (dom.width - child.width) / 2

        // 如果中心点偏移小于2
        if (dom.height / child.height < 3 &&
            Math.abs(vx - px) < 2 &&
            Math.abs(vy - py) < 2 &&
            maxSize * 1.5 > padding) {
            if (dom.id == '04FA8EC9-8076-44B2-B9C9-C346B0C671C7') {
                // debugger;
            }
            if (!dom.padding) {
                dom.padding = {};
            }
            Common.assign(dom, child);
            // dom reset
            dom.type = Store.type.TAG;
            dom.padding["left"] = dom.padding["right"] = padding;
            dom.lineHeight = dom.height;
            dom.textAlign = "center";
            dom.children = [];
            dom.styleAuto["width"] = true;
            return true;
        }
    }
}


/**
 * 逻辑：组内左对齐，居中对齐为一列
 */
let Option = {
        bannerCoefficient: .9
    },
    Config = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}