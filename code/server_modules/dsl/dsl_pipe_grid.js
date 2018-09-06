let Common = require("./dsl_common.js");
let Store = require("./dsl_store.js");

// 聚合
function block(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let s = meta.height < target.height ? meta : target;
        let verticalSpacing = s.text ? s.styles.lineHeight * Config.dsl.textSpacingCoefficient : Config.dsl.verticalSpacing;
        if (meta.id == '1DCF16FB-C993-4488-8F65-34B07DC975BC' &&
            target.id == 'A788AFCC-F51E-44A9-9741-73A09930F779') {
            debugger;
        }
        return meta.type != Store.type.SEGMENTING_HORIZONTAL &&
            target.type != Store.type.SEGMENTING_HORIZONTAL &&
            meta.abY <= target.abY + target.height + verticalSpacing &&
            target.abY <= meta.abY + meta.height + verticalSpacing

    });
    let children = Common.groupByArray(newArr, Store.type.BLOCK);
    return children;
}


// 纵向相邻元素
function column(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return meta.x + meta.width > target.x && meta.x < target.x + target.width
    });
    let children = Common.groupByArray(newArr, Store.type.COLUMN);
    return children;
}
// 横向相邻元素
function inline(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let horizontalSpacing = Config.dsl.horizontalSpacing
        if (meta.type == "QText" && target.type == 'QText') {
            horizontalSpacing = Math.max(meta.size, target.size);
        }
        return (Math.abs(meta.y + meta.height / 2 - target.y - target.height / 2) < Option.errorSpacing ||
                Math.abs(meta.y + meta.height - target.y - target.height) < Option.errorSpacing) &&
            meta.abX + meta.width + horizontalSpacing >= target.abX &&
            target.abX + target.width + horizontalSpacing >= meta.abX
    });
    let children = Common.groupByArray(newArr, Store.type.INLINE);
    return children;
}

function row(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return Math.abs(meta.y + meta.height / 2 - target.y - target.height / 2) < Option.errorSpacing ||
            // 中心对齐
            Math.abs(meta.y + meta.height - target.y - target.height) < Option.errorSpacing ||
            // 底对齐
            Math.abs(meta.y - target.y) < Option.errorSpacing
        // 顶对齐
    });
    let children = Common.groupByArray(newArr, Store.type.ROW);
    return children

}

/**
 * 重组横向、纵向节点位置
 */
function ergodic(json, func) {
    if (json.children) {
        let arr = [],
            ignore = [];
        json.children.forEach((child, i) => {
            if (child.isSegmenting) {
                ignore.push(child)
            } else {
                arr.push(child);
            }
        });
        arr = func(arr);
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
    ergodic(data, block);
    ergodic(data, inline);
    ergodic(data, column);
    ergodic(data, row);
}