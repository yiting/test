let Common = require("./dsl_common.js");
let Store = require("./dsl_store.js");
/**
 * Design-Dom 转为 一维数组
 * @param  {[type]} cur [description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function serialize(cur, arr) {
    arr.push(cur);
    cur.abX = cur.abX || 0;
    cur.abY = cur.abY || 0;
    cur.contrains = {};
    delete cur.parent;
    if (cur.children) {
        cur.children.forEach((c, i) => {
            // c.abX = parseInt(cur.abX || 0) + parseInt(c.x || 0);
            // c.abY = parseInt(cur.abY || 0) + parseInt(c.y || 0);
            if (c.abX < 0) {
                c.abX = 0;
                c.width -= c.abX;
            }
            if (c.abX + c.width > Config.device.width) {
                c.width = Config.device.width - c.abX;
            }
            serialize(c, arr);
        });
        delete cur.children;
    }
    return arr;
}

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


const designDomAttrs = /^(id|type|name|x|y|width|height|children)$/;

function assign(...objects) {
    let json = objects.shift();
    while (objects.length) {
        let obj = objects.shift()
        for (var i in obj) {
            if (designDomAttrs.test(i)) {
                continue;
            };
            if (!obj[i] ||
                obj[i] == '<null>'
            ) {
                continue;
            }
            json[i] = obj[i];
        }
    }
    return json;
}

// 清洗行高，使行高为1.4
// 赋值 textHeight,textY
// 赋值行数lines
function cleanLineHeight(arr) {
    arr.forEach((d, i) => {
        if (d.text) {
            // fontSize
            let maxSize = Number.NEGATIVE_INFINITY,
                minSize = Number.POSITIVE_INFINITY
            d.styles.texts.forEach((s) => {
                maxSize = s.size > maxSize ? s.size : maxSize;
                minSize = s.size < minSize ? s.size : minSize;
            });
            d.styles.maxSize = Math.round(maxSize);
            d.styles.minSize = Math.round(minSize);
            // 当前真实行高
            const lineHeight = d.styles.lineHeight || maxSize * 1.4;
            // 目标行高
            const targetLineHeight = maxSize * Config.dsl.lineHeight
            // 根据高度处以行高，如果多行，则不处理行高
            if (d.height / lineHeight > 1.1) {
                d.lines = Math.round(d.height / lineHeight);
                return;
            }
            d.lines = 1;
            // 当前行高差
            let dir = (lineHeight - maxSize);
            d.textHeight = Math.round(maxSize);
            d.textAbY = Math.round(d.abY + dir / 2);
            // 设置目标行高、高度、Y
            let dif = Math.floor((targetLineHeight - d.height) / 2);
            d.height = d.styles.lineHeight = Math.round(targetLineHeight);
            d.y -= dif;
            d.abY -= dif;
        }
    });
    return arr;
}
/**
 *  标记水平分割线
 */
function markerSegmenting(json) {
    const horizontalLength = json.width * Config.dsl.segmentingCoefficient;
    const verticalLength = json.height * Config.dsl.segmentingCoefficient;
    let arr = [];
    // let index = 0;
    json.children.forEach((d, i) => {
        if (!d.text && (!d.children || d.children.length == 0)) {
            if (d.width / d.height >= Option.segmentingProportion &&
                d.width >= horizontalLength &&
                d.height < Config.dsl.verticalSpacing
            ) {
                // 水平分割线
                d.type = Store.model.SEGMENTING_HORIZONTAL
                arr.push(d);
            } else if (d.width / d.height >= Option.segmentingProportion &&
                d.height >= verticalLength &&
                d.width < Config.dsl.segmentingVerticalWidth) {
                // 垂直分割线
                d.type = Store.model.SEGMENTING_VERTICAL
                arr.push(d);
            }
        }
        arr = arr.concat(markerSegmenting(d));
    });
    return arr;
}
/**/
function mergeBySize(arr) {
    let s = [];
    let d = arr.shift();

    arr.forEach((d, i) => {
        let done = s.some((o, j) => {
            if (d.width == o.width &&
                d.height == o.height &&
                d.abX == o.abX &&
                d.abY == o.abY) {
                // 与父节点大小相同
                assign(o, d);
                return true;
            }
        });
        if (!done) {
            s.push(d);
        }
    })
    return s;
}

// 过滤无效组
function filterUselessGroup(arr) {
    return arr.filter((d, i) => {
        return (
            d.text ||
            d.path ||
            (d.styles && (
                d.styles.opacity != 1 ||
                d.styles.border ||
                d.styles.borderRadius ||
                d.styles.background ||
                d.styles.shadows ||
                d.styles.blending))
        );
    });
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
                d.abY <= o.abY
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
    body.children.forEach((d, i) => {
        d.parent = body.id;
    })
    return;
}
/**
 * 识别多彩内容
 */
function identifyColourful(arr) {
    arr.forEach(o => {
        o.isColourful = o.path || o.styles.border || o.styles.background;
    })
    return arr;
}

let Config = {},
    Option = {
        segmentingProportion: 25,
        segmentingVerticalWidth: 2
    };

function fn(json) {
    let data = JSON.parse(JSON.stringify(json)); // 深复制数据
    data.x = 0;
    data.y = 0;
    let arr = serialize(data, []); // 序列化树
    arr = sortBySize(arr); // 按面积排序
    let body = arr[0];
    arr = filterUselessGroup(arr); // 移除无用组
    arr = mergeBySize(arr); // 合并同大小元素
    arr = cleanLineHeight(arr); // 清洗属性-行高
    // arr = identifyColourful(arr); // 识别彩色的
    let arr2 = arr.concat([]);
    relayer(arr, body); // 重组父子结构
    markerSegmenting(body); // 标记分割线
    return body;
}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}