const Common = require("./dsl_common.js");
const Dom = require("./dsl_dom.js");
const Store = require("./dsl_store.js");
const Logger = require("./logger.js");

let LAYOUT_MAP = {}
LAYOUT_MAP[Dom.layout.INLINE] = 0;
LAYOUT_MAP[Dom.layout.ROW] = 1;
LAYOUT_MAP[Dom.layout.COLUMN] = 2;
LAYOUT_MAP[Dom.layout.BLOCK] = 3;

function groupByArray(newArr, parent, layout) {
    let children = [];
    if (newArr.length == 1 &&
        layout != Dom.layout.INLINE &&
        layout != Dom.layout.COLUMN
    ) {
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        let pos = Dom.calRange(crr),
            dirX = pos.x,
            dirY = pos.y;
        /**
         * 当组内只有一个子节点，且符合以下条件，则不被包裹，减少结构冗余
         */
        if (crr.length == 1 &&
            (
                // 行内布局
                layout == Dom.layout.INLINE ||
                // 列布局
                layout == Dom.layout.COLUMN ||
                // 包裹节点权重小于【被包裹节点】
                (crr[0].type == 'layout' && LAYOUT_MAP[crr[0].layout] >= LAYOUT_MAP[layout]) ||
                // 包裹节点与被包裹节点大小一致
                (pos.x == 0 && pos.width == parent.width)
            )
        ) {
            children.push(crr[0])
            return;
        }
        if (layout == Dom.layout.BLOCK || layout == Dom.layout.ROW) {
            dirX = 0;
            pos.x = 0;
            pos.abX = parent.abX;
            pos.width = parent.width;
        }
        let child = new Dom({
            layout: layout,
            x: pos.x,
            y: pos.y,
            width: pos.width,
            height: pos.height,
            abX: pos.abX,
            abY: pos.abY,
            children: crr
        });
        crr.forEach((d, j) => {
            d.x -= dirX;
            d.y -= dirY;
        });
        children.push(child);
    });
    return children;
}


function calYH(meta) {
    return {
        y: meta.textAbY || meta.abY,
        h: meta.textHeight || meta.height
    }
}


// 聚合
function block(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        if (meta.type == Store.model.SEGMENTING_HORIZONTAL ||
            target.type == Store.model.SEGMENTING_HORIZONTAL) {
            return;
        }
        const small = meta.height < target.height ? meta : target;
        const textSpacing = small.text && (small.styles.lineHeight * Config.dsl.textSpacingCoefficient) || undefined,
            verticalSpacing = textSpacing < Config.dsl.verticalSpacing ? textSpacing : Config.dsl.verticalSpacing


        let meta_yh = calYH(meta),
            target_yh = calYH(target)
        return meta_yh.y < target_yh.y + target_yh.h + verticalSpacing &&
            target_yh.y < meta_yh.y + meta_yh.h + verticalSpacing

    });
    let children = groupByArray(newArr, parent, Dom.layout.BLOCK);
    return children;
}


// 纵向相邻元素
function column(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return meta.abX + meta.width > target.abX &&
            target.abX + target.width > meta.abX
    });

    let children = groupByArray(newArr, parent, Dom.layout.COLUMN);
    return children;
}
// 横向相邻元素
/* function inline(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let horizontalSpacing = Config.dsl.horizontalSpacing;
        return (meta.text || target.text) &&
            Math.abs(meta.abY + meta.height / 2 - target.abY - target.height / 2) < Config.dsl.operateErrorCoefficient &&
            ((meta.abX + meta.width - target.abX <= Config.dsl.operateErrorCoefficient &&
                    meta.abX + meta.width + horizontalSpacing >= target.abX) ||
                (target.abX + target.width - meta.abX <= Config.dsl.operateErrorCoefficient &&
                    target.abX + target.width + horizontalSpacing >= meta.abX))
    });
    let children = groupByArray(newArr, parent, Dom.layout.INLINE);
    return children;
} */
function inline(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        /**
         * 水平阀值规则：
         * 1.含有文案：最小字号
         * 2.没有文案：最小图片大小
         */
        let horizontalSpacing = (meta.type == Dom.type.TEXT && target.type == Dom.type.TEXT) ? Math.max(meta.styles.maxSize, target.styles.maxSize) : Config.dsl.horizontalSpacing;
        /**
         * 规则：
         * 1.中心对齐
         * 2.水平间隙小于阀值
         */
        return Math.abs(meta.abY + meta.height / 2 - target.abY - target.height / 2) < Config.dsl.operateErrorCoefficient &&
            ((meta.abX + meta.width <= target.abX + Config.dsl.operateErrorCoefficient &&
                    meta.abX + meta.width + horizontalSpacing >= target.abX) ||
                (target.abX + target.width <= meta.abX + Config.dsl.operateErrorCoefficient &&
                    target.abX + target.width + horizontalSpacing >= meta.abX))
    });
    let targetArr = [];
    newArr.forEach(arr => {
        if (arr.some(s => s.type == Dom.type.TEXT)) {
            targetArr.push(arr)
        } else {
            targetArr = targetArr.concat(arr.map(s => [s]));
        }
    });
    // let children = groupByArray(newArr, parent, Dom.layout.INLINE);
    let children = groupByArray(targetArr, parent, Dom.layout.INLINE);
    return children;
}

function row(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        if (meta.type == Store.model.SEGMENTING_HORIZONTAL ||
            target.type == Store.model.SEGMENTING_HORIZONTAL) {
            return;
        }
        let meta_yh = calYH(meta),
            target_yh = calYH(target)
        return meta_yh.y + meta_yh.h > target_yh.y &&
            target_yh.y + target_yh.h > meta_yh.y;
    });
    let children = groupByArray(newArr, parent, Dom.layout.ROW);
    return children

}

/**
 * 重组横向、纵向节点位置
 */
function ergodic(json, func, type) {
    // 高权重布局不进入低权重布局进行布局计算
    type = json.layout || type;
    if (json.children) {
        if (LAYOUT_MAP[func.name] < LAYOUT_MAP[type] ||
            (type != func.name && func.name == 'block')) {
            json.children = func(json.children, json);
        }
        json.children.forEach((child) => {
            ergodic(child, func, type);
        });
    }
    return json;
}

/**
 * 逻辑：组内左对齐，居中对齐为一列
 */
let Config = {},
    Option = {
        errorSpacing: 3
    }
module.exports = function (data, conf, opt) {
    Logger.log('[pipe - layout] start')
    Object.assign(Option, opt);
    Object.assign(Config, conf);

    Logger.log('[pipe - layout] block')
    ergodic(data, block);


    Logger.log('[pipe - layout] column')
    ergodic(data, column);

    Logger.log('[pipe - layout] row')
    ergodic(data, row);
    Logger.log('[pipe - layout] inline')
    ergodic(data, inline);
}