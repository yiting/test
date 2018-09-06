let Store = require("./dsl_store.js");
/**
 * functionName
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
let layoutType = [
    Store.type.BLOCK,
    Store.type.COLUMN,
    Store.type.INLINE,
    Store.type.ROW
]
/**
 * 分离结构节点与内容节点
 */
function getChildDom(json, arr) {
    let children = json.children;
    json.children = [];
    if (layoutType.includes(json.type)) {
        arr.push(json);
    }
    children.forEach((child, i) => {
        getChildDom(child, arr)
        if (layoutType.includes(child.type)) {
            json.children = json.children.concat(child.children);
        } else {
            json.children.push(child);
        }
    });
    return arr;
}

/**
 * 内容矩阵化
 */
function matrix(obj) {
    let matrix = new Array(),
        w = obj.width
    while (w--) {
        let a = new Array(obj.height);
        a.fill(0);
        matrix.push(a);
    }
    obj.children.forEach((o) => {
        let w = o.width;
        while (--w) {
            matrix[o.x + w].fill(1, o.y, o.height);
        };
    });
    return matrix;
}

/**
 * 矩阵对比
 */
function matching(a, b) {
    let w = a.length > b.length ? a.length : b.length,
        h = a[0].length > b[0].length ? a[0].length : b[0].length,
        count = w * h,
        res = 0;
    let _w = w;
    let _h = h;
    while (_w > 0) {
        _w--;
        _h = h;
        while (_h > 0) {
            _h--;
            if (a[_w] && b[_w]) {
                res += a[_w][_h] == b[_w][_h] ? 1 : 0
            }
        }
    };

    return {
        res,
        count,
        rate: res / count
    }
}

function matchGroup(arr) {
    let matchResult = [];
    /**
     * 两两对比矩阵
     */
    arr.forEach((a, i) => {
        arr.slice(i + 1).forEach((b) => {
            let o = matching(a.matrix, b.matrix);
            matchResult.push({
                id1: a.id,
                id2: b.id,
                // res: o.res,
                // count: o.count,
                id1Size: `${a.width},${a.height}`,
                id2Size: `${b.width},${b.height}`,
                rate: o.rate
            });
        })
    });
    /**
     * 成组
     */
    let group = [];
    matchResult.forEach((d) => {
        if (d.rate > .8) {
            group.some((g) => {
                let g1 = g.includes(d.id1),
                    g2 = g.includes(d.id2);
                if (g1 && g2) {
                    return true;
                } else if (g1) {
                    g.push(d.id2)
                    return true;
                } else if (g2) {
                    g.push(d.id1)
                    return true;
                }
            }) || group.push([d.id1, d.id2]);
        }
    })
    console.log(group)
    return matchResult;
}

function fn(json) {
    let objs = JSON.parse(JSON.stringify(json));
    let arr = getChildDom(objs, []);
    arr.forEach((obj) => {
        obj.matrix = matrix(obj);
    });
    console.log(arr)
    let matchResult = matchGroup(arr);
    // arr = arr.slice(0, 6);
    // console.log(matchResult)
    return matchResult

}
let Config = {},
    Option = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}