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
 * 创建新组
 */
function groupByArray(newArr, type) {

    var children = [];
    if (newArr.length == 1) {
        return newArr[0];
    }
    newArr.forEach((crr, i) => {
        if (crr.length == 1) {
            children.push(crr[0])
        } else {
            let pos = calRange(crr),
                child = createDom({
                    type: type,
                    x: pos.x,
                    y: pos.y,
                    width: pos.width,
                    height: pos.height,
                    abX: pos.abX,
                    abY: pos.abY,
                    children: crr
                });
            crr.forEach((d, j) => {
                d.x -= pos.x;
                d.y -= pos.y;
            });
            children.push(child);
        }
    });
    return children;
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
        children: []
    }, obj);
    return o;
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


module.exports = {
    groupByArray,
    calRange,
    createDom,
    assign,
    gatherByLogic
}