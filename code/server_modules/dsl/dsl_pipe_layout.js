const Common = require("./dsl_common.js");
const Dom = require("./dsl_dom.js");
const Store = require("./dsl_store.js");
const Logger = require("./logger.js");

let LAYOUT_MAP = {
    inline: 0,
    row: 1,
    column: 2,
    block: 3,
    default: 4
}

function groupByArray(newArr, parent, layout) {
    let children = [];
    if (newArr.length == 1) {
        parent.layout = parent.layout || layout;
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        let pos = Dom.calRange(crr),
            dirX = pos.x,
            dirY = pos.y;
        /**
         * 当组内只有一个子节点，且符合以下条件，则不被包裹，减少结构冗余
         */
        if (crr.length == 1) {
            if (layout != Dom.layout.BLOCK) {
                children.push(crr[0])
                return;
            } else if (pos.width == parent.width && pos.abX == parent.abX) {
                // block
                crr[0].layout = Dom.layout.BLOCK;
                children.push(crr[0])
                return;
            }
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
    /**
     * 通过判断如果有独立元素与纵向组关系相近，则合入该组
     */
    let lonelyArr = newArr.filter(arr => arr.length == 1).map(arr => arr[0]),
        groupArr = newArr.filter(arr => arr.length > 1),
        inlineArr = Common.gatherByLogic(domArr, (meta, target) => {
            // 判断行内组合
            // let horizontalSpacing = Math.max(meta.styles.maxSize||target.styles.maxSize*)||Config.dsl.horizontalSpacing
            let horizontalSpacing = Config.dsl.horizontalSpacing;
            return Math.abs(meta.abY + meta.height / 2 - target.abY - target.height / 2) < Config.dsl.operateErrorCoefficient &&
                ((meta.abX + meta.width <= target.abX + Config.dsl.operateErrorCoefficient &&
                        meta.abX + meta.width + horizontalSpacing >= target.abX) ||
                    (target.abX + target.width <= meta.abX + Config.dsl.operateErrorCoefficient &&
                        target.abX + target.width + horizontalSpacing >= meta.abX));
        });
    let aloneArr = [];
    inlineArr.forEach(inline => {
        // 无交集组合元素，剔除
        if (inline.every(dom => lonelyArr.includes(dom))) {
            // return true;
            aloneArr.push(...inline.map(s=>[s]));
            return true;
        }
        // 完全交集组合元素，剔除
        if (inline.every(dom => !lonelyArr.includes(dom))) {
            return false;
        }
        // 余，半交集元素
        // 找到交集元素，剔除，将组插入新元素组
        let concatColumn = [];
        inline = inline.filter(meta => {
            // 若存在于列组内，则剔除
            let inColumn = false;
            groupArr.forEach(group => {
                // 如果列内包含行元素并且不在新组内，
                if (group.includes(meta)) {
                    // 如果新列内不存在当前列，则添加到新列
                    if (!concatColumn.includes(group)) {
                        concatColumn.push(group);
                    }
                    inColumn = true;
                    return false;
                }
            });
            return !inColumn;
        });
        // 将列组合入独立元素，成新列组
        inline = inline.concat(...concatColumn);
        // 干掉原列组,并入新组
        groupArr = groupArr.filter(group => !concatColumn.includes(group));
        groupArr.push(inline);
    });
    newArr = groupArr.concat(aloneArr);
    return groupByArray(newArr, parent, Dom.layout.COLUMN);
}


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
            (func.name == 'block')
        ) {
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

    Logger.log(`[pipe - layout] block ${data.id}`)
    ergodic(data, block);


    Logger.log(`[pipe - layout] column ${data.id}`)
    ergodic(data, column);

    Logger.log(`[pipe - layout] row ${data.id}`)
    ergodic(data, row);

    Logger.log(`[pipe - layout] inline ${data.id}`)
    ergodic(data, inline);
}