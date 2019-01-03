const Dom = require("./dsl_dom.js");
const Store = require("./dsl_store.js");
const Logger = require('./logger');
const Segmenting = require("./model/segmenting");
const Model = require("./dsl_model");
/**
 * Design-Dom 转为 一维数组
 * @param  {[type]} cur [description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function serialize(arr) {
    let res = []
    arr.forEach(((child, i) => {

        // 剔除完全超出范围元素
        if (child.abX > Config.device.width ||
            child.abY > Config.device.height ||
            child.abX + child.width < 0 ||
            child.abY + child.height < 0) {
            return;
        } else {
            delete child.children;
            res.push(new Dom(child, {
                isRoot: child.type == 'QBody',
                zIndex: i
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
function cleanLineHeight(arr) {
    arr.forEach(dom => Dom.cleanLineHeight(dom, Config.dsl.lineHeight));
    return arr;
}
/**
 *  标记水平分割线
 */
function markerSegmenting(arr, body) {
    // let index = 0;
    arr.forEach((d, i) => {
        if (Segmenting.is(d, body, Config)) {
            Model.adjust(Segmenting, d, body, Config);
        }
    });
    return arr;
}
/**/
function mergeBySize(arr) {
    let s = [];
    arr.shift();

    arr.forEach((d, i) => {
        let done = s.some((o, j) => {
            if (d.width == o.width &&
                d.height == o.height &&
                d.abX == o.abX &&
                d.abY == o.abY) {
                // 与父节点大小相同
                Logger.debug(`[pipe cleanse] mergeBySize ${d.id} to ${o.id}`)
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
            d.source != 'design' ||
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
 * 1. 元素边界不可变
 * 推演： a.非完全包含元素不为父子结构
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function relayer(arr, body) {
    let coms = [body];
        let doms = [];
        //let segmentings = []
    arr.forEach(function (childDom, i) {
        if (!childDom || childDom == body) {
            return;
        }
        let done = coms.some(function (parentDom) {
            /**
             * 在父节点上,
             * 描述：parentDom面积必 大于等于 childDom面积，通过判断是否存在包含关系得出，childDom是否为parentDom子节点
             */
            if (parentDom.type != Dom.type.TEXT &&
                // 如果超出横向屏幕范围，则相连则纳入包含
                ((Dom.isXConnect(parentDom, childDom, -1) && Dom.isYWrap(parentDom, childDom)) ||
                    Dom.isWrap(parentDom, childDom))) {
                childDom.x = childDom.abX - parentDom.abX;
                childDom.y = childDom.abY - parentDom.abY;
                arr[i] = null;
                childDom.parent = parentDom.id;
                coms.unshift(childDom);
                parentDom.children.push(childDom);
                return true;
            }
        });
        if (!done) {
            childDom.x = childDom.abX;
            childDom.y = childDom.abY;
            coms.unshift(childDom);
            doms.unshift(childDom);
            arr[i] = null;
        }
    });
    body.children = body.children.concat(doms)
    body.children.forEach((d, i) => {
        d.parent = body.id;
    })
    return;
}

function fn(json) {
    Logger.debug('[pipe - cleanse] start')

    let data = JSON.parse(JSON.stringify(json)); // 深复制数据

    // 序列化树
    Logger.debug('[pipe - cleanse] serialize')
    let arr = serialize(data);

    let body = getRoot(arr);
    // 按面积排序
    Logger.debug('[pipe - cleanse] sortBySize')
    arr = sortBySize(arr);

    // 移除无用组
    Logger.debug('[pipe - cleanse] filterUselessGroup')
    arr = filterUselessGroup(arr);

    // 清洗属性-行高
    Logger.debug('[pipe - cleanse] cleanLineHeight')
    arr = cleanLineHeight(arr);

    // 合并同大小元素
    Logger.debug('[pipe - cleanse] mergeBySize')
    arr = mergeBySize(arr);
    // 标记分割线
    Logger.debug('[pipe - cleanse] markerSegmenting')
    arr = markerSegmenting(arr, body);

    // 重组父子结构
    Logger.debug('[pipe - cleanse] relayer')
    relayer(arr, body);

    Logger.debug('[pipe - cleanse] end')
    return body;
}
let Config = {},
    Option = {
        segmentingProportion: 25,
    };
module.exports = function (data) {
    Config = this.attachment.config;
    return fn(data);
}