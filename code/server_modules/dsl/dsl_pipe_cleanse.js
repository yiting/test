let Common = require("./dsl_common.js");
let Dom = require("./dsl_dom.js");
let Store = require("./dsl_store.js");
let Logger = require("./logger.js");
/**
 * Design-Dom 转为 一维数组
 * @param  {[type]} cur [description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function serialize(arr) {
    let res = []
    arr.forEach((child => {
        // 剔除完全超出范围元素
        if (child.abX > Config.device.width ||
            child.abY > Config.device.height ||
            child.abX + child.width < 0 ||
            child.abY + child.height < 0) {
            return;
        } else {
            delete child.children;
            res.push(new Dom(child, {
                isRoot: child.type == 'QBody'
            }))
        }
    }))
    return res;
}

function getRoot(arr) {
    return arr.find(dom => dom.isRoot)
}

// 按面积从大到小排序
function sortBySize(arr) {
    let _sort = [],
        area
    arr.forEach(function (dom) {
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


// 清洗行高，使行高为1.4
// 赋值 textHeight,textY
// 赋值行数lines
function cleanLineHeight(arr) {
    arr.forEach(dom => Dom.cleanLineHeight(dom, Config.dsl.lineHeight));
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
                Dom.assign(o, d);
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
            d.special ||
            d.text ||
            d.path ||
            (d.styles && (
                d.styles.opacity != 1 ||
                d.styles.border ||
                d.styles.borderRadius ||
                (d.styles.background && d.styles.background.color && d.styles.background.color.a != 0) ||
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
    arr.forEach(function (o, i) {
        if (!o || o == body) {
            return;
        }
        let done = coms.some(function (d) {
            // 在父节点上
            if (d.abX + d.width >= o.abX + o.width &&
                d.abY + d.height >= o.abY + o.height &&
                d.abX <= o.abX &&
                d.abY <= o.abY &&
                d.type != Dom.type.TEXT
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
    Logger.log('[pipe - cleanse] start')

    let data = JSON.parse(JSON.stringify(json)); // 深复制数据

    // 序列化树
    Logger.log('[pipe - cleanse] serialize')
    let arr = serialize(data);

    let body = getRoot(arr);
    // 按面积排序
    Logger.log('[pipe - cleanse] sortBySize')
    arr = sortBySize(arr);

    // 移除无用组
    Logger.log('[pipe - cleanse] filterUselessGroup')
    arr = filterUselessGroup(arr);

    // 清洗属性-行高
    Logger.log('[pipe - cleanse] cleanLineHeight')
    arr = cleanLineHeight(arr);

    // 合并同大小元素
    Logger.log('[pipe - cleanse] mergeBySize')
    arr = mergeBySize(arr);

    // 重组父子结构
    Logger.log('[pipe - cleanse] relayer')
    relayer(arr, body);

    // 标记分割线
    Logger.log('[pipe - cleanse] markerSegmenting')
    markerSegmenting(body);
    Logger.log('[pipe - cleanse] end')
    return body;
}
module.exports = function (data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}