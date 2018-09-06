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
    delete cur.parent;
    if (cur.children) {
        cur.children.forEach((c, i) => {
            c.abX = parseInt(cur.abX || 0) + parseInt(c.x || 0);
            c.abY = parseInt(cur.abY || 0) + parseInt(c.y || 0);
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

// 清洗行高，使行高为1
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
            d.styles.maxSize = maxSize;
            d.styles.minSize = minSize;
            // lineHeight
            let lineHeight = d.styles.lineHeight || d.minSize * 1.4;
            // 如果多行，则不处理行高
            if (d.height / lineHeight > 1.5) {
                d.lines = Math.round(d.height / lineHeight);
                return;
            }
            d.lines = 1;
            let dif = lineHeight - maxSize,
                diff = Math.floor(dif / 2);
            d.styles.lineHeight = maxSize;
            d.styles._lineHeight = lineHeight;
            d.height -= dif;
            d.y += diff;
            d.abY += diff;
        }
    });
    return arr;
}
/**
 *  标记水平分割线
 */
function markerSegmenting(arr) {
    let horizontalWidth = Config.device.width * Option.segmentingCoefficient;
    Option.segmentingVerticalWidth
    let index = 0;
    arr.forEach((d, i) => {
        if (!d.text && (!d.children || d.children.length == 0)) {
            if (d.width > d.height &&
                d.width >= horizontalWidth &&
                d.height < Config.dsl.verticalSpacing
            ) {
                // 水平分割线
                d.type = Store.type.SEGMENTING_HORIZONTAL
            } else if (d.width < Option.segmentingVerticalWidth &&
                d.height > d.width) {
                // 垂直分割线
                d.type = Store.type.SEGMENTING_VERTICAL
            }
        }
        /*if (d.width >= horizontalWidth && (d.isSegmenting || !segmentingArr[d.abY])) {
            index++;
            segmentingArr.fill(index, d.abY, d.abY + d.height);
        }*/
    });
    let segmentingArr = new Array(Config.page.height);
    /*let cur, start = 0,
        height;
    segmentingArr.forEach((d, i) => {
        if (d !== cur) {
            height = i - start;
            if (height > 0) {
                let dom = Common.createDom({
                    type: "box",
                    x: 0,
                    abX: 0,
                    y: start,
                    abY: start,
                    width: Config.page.width,
                    height: height
                });
                arr.push(dom);
            }
            start = i;
            cur = d;
        }
    });*/
    return arr;
}

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
            (d.styles &&
                d.styles.opacity != 1 ||
                d.styles.border ||
                d.styles.borderRadius ||
                d.styles.background ||
                d.styles.shadows ||
                d.styles.blending)
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

let Config = {},
    Option = {
        segmentingCoefficient: .7,
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
    markerSegmenting(arr); // 标记分割线
    relayer(arr, body); // 重组父子结构
    return body;
}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}