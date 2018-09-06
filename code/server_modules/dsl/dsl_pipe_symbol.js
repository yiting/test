let Common = require("./dsl_common.js");

let extractKeys = []

function serialize(json, arr = []) {
    arr.push(json);
    json.children && json.children.forEach((child, i) => {
        serialize(child, arr);
    })
    return arr;
}

function fn(json, level = 0) {
    let prepareSymbol = [];
    // let arr = serialize(json);

    if (json.children) {
        json.children.forEach(fn);
        symbol(json.children);
    }
}
// 检查各子节点位置差异
function checkChildPosition(meta, target) {
    let metaArr = [],
        matchingCount = 0
    target.forEach((t, i) => {
        meta.forEach((m, j) => {
            if ((t.x == m.x &&
                    t.y == m.y) ||
                (t.x + t.width / 2 == m.x + m.width / 2 &&
                    t.y + t.height / 2 == t.y + t.height / 2)) {
                matchingCount++;
            }
        })
    });
    return matchingCount;
}
// 抽取公共样式
function extractCommonStyles(arr) {
    let obj = {
        width: undefined,
        height: undefined,
        opacity: undefined,
        rotation: undefined,
        flip: undefined,
        blending: undefined,
        shadows: undefined,
        borderRadius: undefined,
        blur: undefined,
        verticalAlign: undefined,
        letterSpacing: undefined,
        paragraph: undefined,
        lineHeight: undefined,
        textAlign: undefined,
        textDecoration: undefined
    };
    arr.forEach((child, i) => {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === null) {
                return;
            } else if (!obj[key]) {
                obj[key] = JSON.stringify(child[key]);
            } else if (obj[key] !== JSON.stringify(child[key])) {
                obj[key] = null;
            }
        });
    });
    Object.keys(obj).forEach((key) => {
        if (!obj[key]) {
            delete obj[key]
        }
    });

    return obj;
}
// 聚合
function symbol(domArr) {
    let newArr = Common.gatherByLogic(domArr, (meta, target) => {
        return (
            /**
             * logic
             */
            // 高或宽相同
            (meta.height == target.height ||
                meta.width == target.width) &&
            // 类型相同
            meta.type == target.type &&
            // 其他特征
            // 自结构相同
            (
                (meta.children.length == target.children.length &&
                    (meta.children.length == 0 ? true : checkChildPosition(meta.children, target.children) / meta.children.length > Option.structureMatching)
                ) ||
                // 特殊结构相同
                (meta.borderRadius > 0 && meta.borderRadius == target.borderRadius)

            )

        )
    });
    // console.log(newArr)
    // newArr.forEach((c, i) => {
    //     if (c.length > 1) {
    //         // console.log(c);
    //         console.log(c, extractCommonStyles(c));
    //     }
    // });
}
let Config = {},
    Option = {
        structureMatching: .7
    }
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    fn(data);
}