
/**
 * 根据逻辑对内容分组
 * @param  {[type]} domArr [description]
 * @param  {[type]} logic  [description]
 * @return {[type]}        [description]
 */
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


// 按面积从大到小排序
function sortByLogic(arr, logic) {
    let _sort = [],
        index
    arr.forEach(function(dom) {
        index = logic(dom);
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

module.exports = {
    sortByLogic,
    gatherByLogic,
}