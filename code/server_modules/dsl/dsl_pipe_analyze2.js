let Store = require("./dsl_store.js");
/**
 * functionName
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
/**
 * 分离结构节点与内容节点
 */

function serialize(json) {
    let arr = [];
    if (Object.values(Store.layout).includes(json.layout)) {
        arr.push(json);
        json.nodes = getChildDom(json)
    }
    json.children.forEach(child => {
        arr = arr.concat(serialize(child));
    })
    return arr;
}

function getChildDom(json) {
    let nodes = [];
    json.children.forEach(child => {
        if (Object.values(Store.layout).includes(child.layout)) {
            nodes = nodes.concat(getChildDom(child));
        } else {
            nodes.push(child);
        }
    });
    return nodes;
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
        let w = (o.type == Store.model.TEXT || o.type == Store.model.PARAGRAPH) ? o.styles.maxSize : o.width,
            h = (o.type == Store.model.TEXT || o.type == Store.model.PARAGRAPH) ? o.styles.maxSize : o.height

        // let w = o.width,
        // h = o.height
        while (--w) {
            matrix[o.x + w].fill(1, o.y, h);
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

/**
 * 两两对比矩阵列表
 */
function matchMatrix(arr) {
    let matchResult = [];
    arr.forEach((a, i) => {
        arr.slice(i + 1).forEach((b) => {
            let o = matching(a.matrix, b.matrix);
            matchResult.push({
                id1: a.id,
                id2: b.id,
                obj1: a,
                obj2: b,
                // res: o.res,
                // count: o.count,
                id1Size: `${a.width},${a.height}`,
                id2Size: `${b.width},${b.height}`,
                rate: o.rate
            });
        })
    });
    return matchResult;
}

/**
 * 同比率矩阵成组
 */
function groupMatch(matchResult) {
    let group = [];
    matchResult.forEach((d) => {
        if (d.rate > .9) {
            group.some((g) => {
                let g1 = g.some(s => s.id == d.id1),
                    g2 = g.some(s => s.id == d.id2);
                if (g1 && g2) {
                    return true;
                } else if (g1) {
                    g.push(d.obj2)
                    return true;
                } else if (g2) {
                    g.push(d.obj1)
                    return true;
                }
            }) || group.push([d.obj1, d.obj2]);
        }
    });
    return group;
}

function markGroup(arr) {
    arr.forEach(d => {

    })
}

function fn(json) {
    let objs = JSON.parse(JSON.stringify(json));
    let arr = serialize(objs);
    arr.forEach((obj) => {
        obj.matrix = matrix(obj);
    });
    let matchResult = matchMatrix(arr);
    let group = groupMatch(matchResult);
    return matchResult

}
let Config = {},
    Option = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}