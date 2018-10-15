const Common = require("./dsl_common.js");
const Store = require("./dsl_store.js");


/**
 * 创建新组
 */
/*function groupByArray(newArr, layout, elseLayout) {
    var children = [];
    if (newArr.length == 1) {
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        if (crr.length == 1) {
            if (elseLayout && !Object.values(Store.layout).includes(crr[0].layout)) {
                crr[0].layout = elseLayout;
            }
            children.push(crr[0])
        } else {
            let pos = Common.calRange(crr),
                child = Common.createDom({
                    type: "layout",
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
                d.x -= pos.x;
                d.y -= pos.y;
            });
            children.push(child);
        }
    });
    return children;
}
*/


let LAYOUT_MAP = {}
LAYOUT_MAP[Store.layout.INLINE] = 0;
LAYOUT_MAP[Store.layout.COLUMN] = 1;
LAYOUT_MAP[Store.layout.ROW] = 1;
LAYOUT_MAP[Store.layout.BLOCK] = 2;

function groupByArray(newArr, parent, layout) {
    let children = [];
    if (newArr.length == 1) {
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        let pos = Common.calRange(crr),
            dirX = pos.x,
            dirY = pos.y;
        /**
         * 当组内只有一个子节点，且符合以下条件，则不被包裹，减少结构冗余
         */
        if (crr.length == 1 &&
            (
                // 行内布局
                layout == Store.layout.INLINE ||
                // 列布局
                layout == Store.layout.COLUMN ||
                // 包裹节点】权重小于【被包裹节点】
                (crr[0].type == 'layout' && LAYOUT_MAP[crr[0].layout] >= LAYOUT_MAP[layout]) ||
                // 包裹节点与被包裹节点大小一致
                (pos.x == 0 && pos.width == parent.width)
            )
        ) {
            children.push(crr[0])
            return;
        }
        if (layout == Store.layout.BLOCK || layout == Store.layout.ROW) {
            dirX = 0;
            pos.x = 0;
            pos.abX = parent.abX;
            pos.width = parent.width;
        }
        let child = Common.createDom({
            type: "layout",
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
        let s = meta.height < target.height ? meta : target;
        const textSpacing = s.text && (s.styles.lineHeight * Config.dsl.textSpacingCoefficient),
            verticalSpacing = textSpacing < Config.dsl.verticalSpacing ? textSpacing : Config.dsl.verticalSpacing

        let meta_yh = calYH(meta),
            target_yh = calYH(target)
        return meta_yh.y <= target_yh.y + target_yh.h + verticalSpacing &&
            target_yh.y <= meta_yh.y + meta_yh.h + verticalSpacing

    });
    let children = groupByArray(newArr, parent, Store.layout.BLOCK);
    return children;
}


// 纵向相邻元素
function column(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return meta.abX + meta.width > target.abX &&
            target.abX + target.width > meta.abX
    });
    let children = groupByArray(newArr, parent, Store.layout.COLUMN);
    return children;
}
// 横向相邻元素
function inline(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let horizontalSpacing = meta.text && target.text ?
            Math.max(meta.styles.maxSize, target.styles.maxSize) :
            Config.dsl.horizontalSpacing;
        let meta_yh = calYH(meta),
            target_yh = calYH(target)
        return ((meta_yh.y + meta_yh.h > target_yh.y) &&
                (target_yh.y + target_yh.h > meta_yh.y)) &&
            ((meta.abX + meta.width <= target.abX &&
                    meta.abX + meta.width + horizontalSpacing > target.abX) ||
                (target.abX + target.width <= meta.abX &&
                    target.abX + target.width + horizontalSpacing > meta.abX))
    });
    let children = groupByArray(newArr, parent, Store.layout.INLINE);
    return children;
}

function row(domArr, parent) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let meta_yh = calYH(meta),
            target_yh = calYH(target)
        return meta_yh.y + meta_yh.h > target_yh.y &&
            target_yh.y + target_yh.h > meta_yh.y;
    });
    let children = groupByArray(newArr, parent, Store.layout.ROW);
    return children

}

/**
 * 重组横向、纵向节点位置
 */
function ergodic(json, func) {
    if (json.layout && LAYOUT_MAP[func.name] > LAYOUT_MAP[json.layout]) {
        return
    }
    if (json.children) {
        let arr = [],
            ignore = [];
        json.children.forEach((child, i) => {
            if (child.type == Store.model.SEGMENTING_HORIZONTAL ||
                child.type == Store.model.SEGMENTING_VERTICAL
            ) {
                ignore.push(child)
            } else {
                arr.push(child);
            }
        });
        arr = func(arr, json);
        json.children = arr.concat(ignore);
        arr.forEach((child) => {
            ergodic(child, func)
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
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    ergodic(data, inline);
    ergodic(data, block);
    ergodic(data, column);
    ergodic(data, row);
}