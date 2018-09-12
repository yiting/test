const Common = require("./dsl_common.js");
const Store = require("./dsl_store.js");




/**
 * 创建新组
 */
function groupByArray(newArr, type) {

    var children = [];
    if (newArr.length == 1) {
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        if (crr.length == 1) {
            if (!Object.values(Store.layout).includes(crr[0].type)) {
                crr[0].type = type;
            }
            children.push(crr[0])
        } else {
            let pos = Common.calRange(crr),
                child = Common.createDom({
                    type: type,
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





// 聚合
function block(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let s = meta.height < target.height ? meta : target;
        let verticalSpacing = s.text ? s.styles.lineHeight * Config.dsl.textSpacingCoefficient : Config.dsl.verticalSpacing;
        return meta.type != Store.model.SEGMENTING_HORIZONTAL &&
            target.type != Store.model.SEGMENTING_HORIZONTAL &&
            meta.abY <= target.abY + target.height + verticalSpacing &&
            target.abY <= meta.abY + meta.height + verticalSpacing

    });
    let children = groupByArray(newArr, Store.layout.BLOCK);
    return children;
}


// 纵向相邻元素
function column(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return meta.x + meta.width > target.x && meta.x < target.x + target.width
    });
    let children = groupByArray(newArr, Store.layout.COLUMN);
    return children;
}
// 横向相邻元素
function inline(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        let horizontalSpacing = Config.dsl.horizontalSpacing
        /*if (meta.id == "AE2C94F3-435B-492D-9011-74D5141783E8" &&
            target.id == "63FADA10-9CDD-4980-B63B-6FCF014A2065"
        ) {
            debugger;
        }*/
        if (meta.type == "QText" && target.type == 'QText') {
            horizontalSpacing = Math.max(meta.size, target.size);
        }
        return (Math.abs(meta.y + meta.height / 2 - target.y - target.height / 2) < Option.errorSpacing ||
                Math.abs(meta.y + meta.height - target.y - target.height) < Option.errorSpacing) &&
            meta.abX + meta.width + horizontalSpacing >= target.abX &&
            target.abX + target.width + horizontalSpacing >= meta.abX
    });
    let children = groupByArray(newArr, Store.layout.INLINE);
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
    let children = groupByArray(newArr, Store.layout.ROW);
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
        // if (!Object.values(Store.layout).includes(json.type)) {
            arr = func(arr);
            json.children = arr.concat(ignore);
        // }
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