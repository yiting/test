function gatherByLogic(domArr, logic) {
    let newArr = [];
    domArr.forEach((meta, i) => {
        var st = newArr.find((n, k) => {
            return n.includes(meta);
        });
        if (!st) {
            st = [meta];
            newArr.push(st);
        }
        domArr.forEach((target, j) => {
            if (target == meta || st.includes(target)) {
                return;
            }
            if (logic(meta, target)) {
                let qr = newArr.find((n, qi) => {
                    return n.includes(target)
                })
                if (qr) {
                    st = newArr[newArr.indexOf(st)] = st.concat(qr);
                    newArr.splice(newArr.indexOf(qr), 1);
                } else {
                    st.push(target);
                }

            }
        })
    });
    return newArr;
}


/**
 * 创建空Dom
 */
let createDomIndex = 0;

function createDom(obj) {
    let o = Object.assign({
        id: (++createDomIndex),
        type: obj.type,
        name: obj.name || '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        contrains: {},
        children: []
    }, obj);
    return o;
}

// 按面积从大到小排序
function sort(arr, cal) {
    let _sort = [],
        index
    arr.forEach(function(dom) {
        index = cal(dom);
        if (!_sort[index]) {
            _sort[index] = [];
        }
        _sort[index].push(dom);
    });
    let domArr = Array.prototype.concat.apply([], _sort.filter((s) => {
        return s !== undefined;
    }));
    return domArr;
}

let designDomAttrs = /^(id|type|name|abX|abY|x|y|width|height|children)$/;

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

// 计算组高宽
function calRange(doms) {
    let o = {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
        abX: Number.POSITIVE_INFINITY,
        abY: Number.POSITIVE_INFINITY,
        width: 0,
        height: 0
    }
    let right = 0,
        bottom = 0
    doms.forEach((d, i) => {
        o.x = d.x < o.x ? d.x : o.x;
        o.y = d.y < o.y ? d.y : o.y;
        o.abX = d.abX < o.abX ? d.abX : o.abX;
        o.abY = d.abY < o.abY ? d.abY : o.abY;
        right = right < (d.x + d.width) ? d.x + d.width : right;
        bottom = bottom < (d.y + d.height) ? d.y + d.height : bottom;
        // o.height = (o.y + o.height) < (d.y + d.height) ? (d.y + d.height - o.y) : o.height;
    });
    o.height = bottom - o.y;
    o.width = right - o.x;
    return o;
}
/**
 * 计算中心偏移
 */
function calOffset(cur){

}

/**
 * 计算margin
 */
function calMargin(cur, parent, prev, next, direction) {
    // 水平布局
    if (!parent) {
        return {};
    }
    let o = {};
    if (direction == 'x') {
        o["left"] = cur.x - (prev ? (prev.x + prev.width) : 0)
        o["right"] = (next ? next.x : parent.width) - cur.x - cur.width;
        o["top"] = cur.y;
        o["bottom"] = parent.height - cur.y - cur.height;
    } else if (direction == 'y') {
        o["top"] = cur.y - (prev ? (prev.y + prev.height) : 0)
        o["bottom"] = (next ? next.y : parent.height) - cur.y - cur.height;
        o["left"] = cur.x;
        o["right"] = parent.width - cur.x - cur.width;
    } else {
        o["left"] = o.x;
        o["right"] = parent.width - o.x - o.width;
        o["top"] = o.y;
        o["bottom"] = parent.height - o.y - o.height;
    }
    return o;
}

function calPosition(cur, parent) {
    let o = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    if (parent) {
        o.left = cur.x;
        o.top = cur.y;
        o.right = parent.width - cur.x - cur.width;
        o.bottom = parent.height - cur.y - cur.height
    }
    return o;
}

/**
 * 是否水平
 */
function isHorizontal(arr, errorCoefficient = 0) {
    let prev;
    return arr.every(meta => {
        if (!prev) {
            prev = meta;
            return true;
        }
        const meta_abY = meta.textAbY||meta.abY,
            prev_abY = prev.textAbY||prev.abY,
            meta_height = meta.textHeight||meta.height,
            prev_height = prev.textHeight||prev.height;

        let res = (meta_abY <= prev_abY + prev_height + errorCoefficient) &&
            (prev_abY <= meta_abY + meta_height + errorCoefficient);
        prev = meta;
        return res;
    })
}
/**
 * 是否垂直
 */
function isVertical(arr, errorCoefficient = 0) {
    let prev;
    return arr.every(meta => {
        if (!prev) {
            prev = meta;
            return true;
        }
        let res = meta.abX <= prev.abX + prev.width + errorCoefficient &&
            prev.abX <= meta.abX + meta.width + errorCoefficient;
        prev = meta;
        return res;
    })
}

module.exports = {
    sort,
    calMargin,
    calRange,
    createDom,
    assign,
    gatherByLogic,
    isHorizontal,
    isVertical,
    calPosition,
}