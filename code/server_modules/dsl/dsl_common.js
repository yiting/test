/**
 * 根据逻辑对内容分组
 * @param  {[type]} domArr [description]
 * @param  {[type]} logic  [description]
 * @return {[type]}        [description]
 */
module.exports.gatherByLogic = function (domArr, logic) {
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
 * 将驼峰命名转为“-”分割的命名
 */
module.exports.nameLower = function (str) {
    return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
}

/**
 * 按面积从大到小排序
 * @param {Array} arr 排序的数据链
 * @param {Function} logic 比较逻辑
 */
module.exports.sortByLogic = function (arr, logic) {
    let _sort = [],
        index
    arr.forEach(function (dom) {
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
/**
 * 返回重复结构组
 * @param {Array} arr 需要识别循环/重复项的数据链
 * @param {Function} logic 比较逻辑
 * @param {Function} feature 比较特征
 */
module.exports.repeatRule = function (arr, logic, feature) {
    let pit = [];
    arr = arr.map((s, i) => {
        // 返回特征值
        return feature ? feature(s, i) : s;
    });
    arr.forEach((s, i) => {
        // 开始遍历
        let lastIndex = i + 1;
        for (let index = 0; index < lastIndex; index++) {
            // 当前片段
            const fragment = arr.slice(index, lastIndex);
            // 前片段
            const prevIndex = index - fragment.length
            if (prevIndex < 0) {
                //没有可比较对象
                continue;
            }
            const prevFragment = arr.slice(prevIndex, index)
            const isRepeat = fragment.every((f, fi) => {
                return logic ? logic(f, prevFragment[fi]) :
                    f == prevFragment[fi];
            });
            if (!isRepeat) {
                continue
            }
            pit.some(p => {
                let existing = p.target.some(s => {
                    return s.length == prevFragment.length && s.every((t, ti) => t == prevFragment[ti])
                });
                if (existing) {
                    p.target.push(fragment);
                }
                return existing;
            }) || pit.push({
                feature: prevFragment.length,
                target: [prevFragment, fragment]
            })
        }
    });
    let _RepeatMap = [];
    // 剔除重复项
    let sorter = pit.sort((a, b) => {
        // 按最大公约重复因子-降序排序
        return b.feature.length - a.feature.length;
    }).sort((a, b) => {
        // 按最多重复数-降序排序
        return b.target.length - a.target.length;
    }).filter(s => {
        return s.target.every(target => {
            const existing = target.every(t => _RepeatMap.includes(t.id));
            if (!existing) {
                _RepeatMap.push(...target.map(t => t.id))
            }
            return !existing;
        })
    });
    return sorter;
}
/**
 * 相似性分组
 * @param {Array} arr 对比数组
 * @param {Function} logic 对比逻辑
 */
module.exports.similarRule = function (arr, logic) {
    let pit = [];
    // 相似特征分组
    arr.forEach((s, i) => {
        // 开始遍历
        let lastIndex = i + 1;
        for (let index = 0; index < lastIndex; index++) {
            // 获取片段
            let fragment = arr.slice(index, lastIndex);
            // 排除完全重复的独立项
            if (fragment.length > 1 && fragment.every((s, i) => {
                    return i == 0 || (logic ? logic(s, fragment[i - 1]) : s == fragment[i - 1])
                })) {
                continue;
            }

            //    判断重复片段
            pit.some(p => {
                // existing:当前片段与缓存片段，每一段都符合逻辑特征判断
                let existing = p.feature == fragment.length && p.target.some(t => {
                    //  只有一个特征时，还须连续的重复；多个特征时，只需逻辑相同
                    return (p.feature == 1 ? index == p.lastIndex + 1 : true) &&
                        t.every((f, fi) => {
                            return logic ? logic(f, fragment[fi]) : (f == fragment[fi]);
                        });
                });
                if (existing && (p.lastIndex + p.feature) <= index) {
                    // 如果重复，且当前节点在上一个重复片段的节点之后
                    p.target.push(fragment);
                    p.indexs.push(index);
                    p.lastIndex = index;
                    return true;
                }
            }) || (pit.push({
                feature: fragment.length,
                target: [fragment],
                indexs: [index],
                lastIndex: index
            }));
        }
    });
    let indexMap = new Array(arr.length);
    //  剔除不重复项
    let sorter = pit.filter(s => s.target.length > 1)
        //  按最高重复数，降序
        .sort((a, b) => {
            return b.target.length - a.target.length
        })
        // 按最大重复因子数， 降序
        .sort((a, b) => {
            return b.feature - a.feature
        })
        //  筛选已被选用的节点组
        .filter(s => {
            let indexs = [];
            s.target = s.target.filter((target, idx) => {
                let index = s.indexs[idx];
                //  提取序列组，检测重复组的序列是否已经被使用过
                if (indexMap.slice(index, index + s.feature).every(i => i !== true)) {
                    indexs.push(index);
                    return true;
                }
            });
            //  剔除只有一个重复项的重复组
            if (s.target.length > 1) {
                s.indexs = indexs;
                indexs.forEach(index => {
                    indexMap.fill(true, index, index + s.feature);
                });
                return true;
            }
        })
    return sorter
}

function _guid() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
}
module.exports.guid = function () {
    return (_guid() + _guid() + "-" + _guid() + "-" + _guid() + "-" + _guid() + "-" + _guid() + _guid() + _guid());
}