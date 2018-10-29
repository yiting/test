let Common = require("./dsl_common.js");
let Store = require("./dsl_store.js");
// 按面积从大到小排序
function sortBySize(arr) {
    let _sort = [],
        area
    arr.forEach(function(dom) {
        area = dom.width * dom.height;
        dom.children = [];
        if (!_sort[area]) {
            _sort[area] = [];
        }
        _sort[area].push(dom);
    });
    let domArr = Array.prototype.concat.apply([], _sort.filter((s) => {
        return s !== undefined;
    })).reverse();
    return domArr;
}

/**
 * 重组父子结构
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function relayer(arr, body) {
    var coms = [body],
        doms = [];
    arr.forEach(function(o, i) {
        if (!o || o == body) {
            return;
        }
        let done = coms.some(function(d, j) {
            // 在父节点上
            if (d.abX + d.width >= o.abX + o.width &&
                d.abY + d.height >= o.abY + o.height &&
                d.abX <= o.abX &&
                d.abY <= o.abY &&
                d.type != 'QText'
            ) {
                o.x = o.abX - d.abX;
                o.y = o.abY - d.abY;
                arr[i] = null;
                o.parent = d.id;
                coms.unshift(o);
                d.children.push(o);
                return true;
            }
        });
        if (!done) {
            o.x = o.abX;
            o.y = o.abY;
            coms.unshift(o);
            doms.unshift(o);
            arr[i] = null;
        }
    });
    body.children = body.children.concat(doms);
    body._nodes = body.children.concat([]);
    return;
}
let Config = {},
    Option = {
        segmentingProportion: 25,
        segmentingVerticalWidth: 2
    };

function fn(arr) {
    arr = sortBySize(arr); // 按面积排序
    let body = arr[0];
    // arr = filterUselessGroup(arr); // 移除无用组
    // arr = mergeBySize(arr); // 合并同大小元素
    // arr = cleanLineHeight(arr); // 清洗属性-行高
    // arr = identifyColourful(arr); // 识别彩色的
    // let arr2 = arr.concat([]);
    relayer(arr, body); // 重组父子结构
    // markerSegmenting(body); // 标记分割线
    return body;
}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}
