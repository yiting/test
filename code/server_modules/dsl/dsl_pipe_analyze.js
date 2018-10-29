let Dom = require("./dsl_dom.js");
let Matrixs = require("./dsl_matrixs.js");


/**
 * 分离结构节点与内容节点
 */
function serialize(json) {
    let arr = [];
    if (json.type == 'layout') {
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
        // if (Object.values(Dom.layout).includes(child.layout)) {
        if (child.type == 'layout') {
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
    let m = {
        width: obj.width,
        height: obj.height,
        matrix: []
    }
    obj.children.forEach((o) => {
        m.matrix.push({
            width: o.width,
            height: o.height,
            x: o.abX - obj.abX,
            y: o.abY - obj.abY
        })
    });
    return m;
}

/**
 * 矩阵对比
 */
function matching(a, b) {
    const size = Math.max(a.width * a.height, b.width * b.height);
    let res = 0;
    a.matrix.forEach(p1 => {
        b.matrix.forEach(p2 => {
            const x = Math.max(p1.x, p2.x),
                y = Math.max(p1.y, p2.y),
                width = Math.min(p1.x + p1.width, p2.x + p2.width) - x,
                height = Math.min(p1.y + p1.height, p2.y + p2.height) - y;
            if (width > 0 && height > 0) {
                res += width * height;
            }
        });
    });
    return {
        res,
        size,
        rate: res / size
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
function groupMatch(matchResult, rate) {
    let group = [];
    matchResult.forEach((d) => {
        if (d.rate > rate) {
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
    });
    return group;
}


function matchModels(arr) {
    let matchResult = [];
    arr.forEach(dom => {
        let d = {
            id: dom.id,
            model: '',
            rate: 0
        };
        matchResult.push(d);
        Object.keys(Matrixs).forEach(modelName => {
            let o = matching(dom.matrix, Matrixs[modelName]);
            if (o.rate > d.rate) {
                d.rate = o.rate;
                d.model = modelName;
            }
        })
    });
    return matchResult;
}

/**
 * 标记模型
 */
function markModel(json, matchResult, rate) {
    let group = [];
    matchResult.forEach(r => {
        if (r.id == json.id && r.rate > rate) {
            json._model = r.model;
            json._modelRate = r.rate;
            console.log(json)
        }
    })
    if (!json.children) {
        return;
    }
    json.children.forEach(c => {
        markModel(c, matchResult, rate);
    })
}

function markGroup(json, arr) {
    arr.forEach((l, i) => {
        if (l.includes(json.id)) {
            json._groupId = 'group' + i;
        }
    })
    if (!json.children) {
        return;
    }
    json.children.forEach(c => {
        markGroup(c, arr);
    });
}

function fn(json) {
    let objs = JSON.parse(JSON.stringify(json));
    // 筛选每个结构有效子节点，序列化为一维数组
    let arr = serialize(objs);
    // 矩阵化每个结构
    arr.forEach((obj) => {
        obj.matrix = matrix(obj);
    });
    // 矩阵对比，输出结果
    let matchMatrixResult = matchMatrix(arr);
    // 矩阵结果分组
    let group = groupMatch(matchMatrixResult, Option.groupRate);
    // 组标记
    markGroup(json, group);
    // 模型对比结果
    // let matchModelsResult = matchModels(arr);
    // markModel(json, matchModelsResult, Option.modelRate)

    Option.matchGroup && Option.matchGroup(matchMatrixResult)
    Option.matchModel && Option.matchModel(matchModelsResult)
    return json;
}
let Config = {},
    Option = {
        groupRate: .9,
        modelRate: .5
    }
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}