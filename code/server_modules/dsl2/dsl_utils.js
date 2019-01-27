// 此模块用于定义一些在dsl模块包中用到的工具函数
//
const Common = require('./dsl_common.js');

const utils = {
    /**
     * 从传入的nodes中,根据beginX, beginY, optimizeWidth, optimizeHeight参数
     * 获取对应范围的的node节点
     * @param {Array} nodes 需要分范围获取的节点
     * @param {Int} beginX 范围开始的x坐标
     * @param {Int} beginY 范围开始的y坐标
     * @param {Int} optimizeWidth 范围的宽度
     * @param {Int} optimizeHeight 范围的高度
     */
    getNodesFromSize: function (nodes, beginX, beginY, optimizeWidth, optimizeHeight) {
        let result = [];
        nodes.forEach(item => {
            if (item.abX >= beginX &&
                item.abX < beginX + optimizeWidth &&
                item.abY >= beginY &&
                item.abY < beginY + optimizeHeight) {

                result.push(item);
            }
        });

        return result;
    },

    /**
     * 将模型按优先级进行排序, 优先级相同则按数量优先
     * @param {Array} list 模型列表 
     */
    sortModelList: function (list) {
        let arr = [];
        let len = list.length;
        list.forEach(item => {
            arr.push(item);
        });

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                if (arr[j].priority < arr[j + 1].priority) {
                    let temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                } else if (arr[j].priority == arr[j + 1].priority) {
                    if (arr[j].getNumber() < arr[j + 1].getNumber()) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        }

        return arr;
    },

    /**
     * 从节点列表中, 删除匹配后的节点
     * @param {Array} nodes 需要处理的节点
     * @param {Array} arr 需要减少的节点
     */
    removeMatchedNodes: function (nodes, arr) {
        if (!nodes || nodes.length == 0 || !arr || arr.length == 0) {
            return;
        }

        arr.forEach(item => {
            // 从nodes上移除
            for (let i = 0; i < nodes.length; i++) {
                if (item.id == nodes[i].id) {
                    nodes.splice(i, 1);
                    break;
                }
            }
        });
    },

    /**
     * 从元素模型列表中, 删除匹配后的元素
     * @param {Array} nodes 需要处理的节点
     * @param {Array} arr 需要减少的节点
     */
    removeMatchedDatas: function (nodes, arr) {
        if (!nodes || nodes.length == 0 || !arr || arr.length == 0) {
            return;
        }

        // arr里面的是MatchData, nodes里面的是designjson数据, 所以要读取里面的节点, 然后移除
        arr.forEach(matchData => {
            let removeNodes = matchData.getMatchNode();

            removeNodes.forEach(rnode => {
                for (let i = 0; i < nodes.length; i++) {
                    if (rnode.id == nodes[i].id) {
                        nodes.splice(i, 1);
                        break;
                    }
                }
            });
        });
    },

    /**
     * 从数组中移除为null的节点
     * @param {Array} arr 移除为null的节点 
     */
    removeNullObject: function (arr) {
        if (!arr || arr.length == 0) {
            return;
        }

        let result = [];
        // 为了方便看, 倒序排
        // for (let i = arr.length - 1; i >= 0; i--) {
        //     if (arr[i] != null) {
        //         result.push(arr[i]);
        //     }
        // }
        arr.forEach(item => {
            if (item != null) {
                result.push(item);
            }
        });

        return result;
    },

    /**
     * 随机排列节点的算法函数
     * @param {Array} nodes 需要组合的节点
     * @param {Int} textNum 组合里的QText元素数量
     * @param {Int} iconNum 组合里的QIcon元素数量
     * @param {Int} imageNum 组合里的QImage元素数量
     * @param {Int} shapeNum 组合里的QShape元素数量
     */
    getGroupFromNodes: function (nodes, textNum, iconNum, imageNum, shapeNum) {
        if (!nodes || !nodes.length || nodes.length == 0) {
            return null;
        }
        // 为了减少计算量, 这里不需做完全随机, 这里分两步优化, 输进来的nodes节点已根据尺寸分步输入, 减少节点两
        // 通过textNum, iconNum, imageNum, shapeNum的数量来做随机
        const typeNum = 4;
        let result = [];
        let result_temp = [];

        // 筛选出用于匹配的各类型节点
        let textNodes = [];
        let iconNodes = [];
        let imageNodes = [];
        let shapeNodes = [];

        nodes.forEach(item => {
            switch (item.type) {
                case Common.QText:
                    textNodes.push(item);
                    break;
                case Common.QIcon:
                    iconNodes.push(item);
                    break;
                case Common.QImage:
                    imageNodes.push(item);
                    break;
                case Common.QShape:
                    shapeNodes.push(item);
                    break;
                default:
                    ;
            }
        });

        // 根据每类元素需要的个数获取所有可以排列的组合,然后再对这四类进行排列
        let typeRandom = [];
        typeRandom[0] = this.getRandomGroup(textNodes, textNum);
        typeRandom[1] = this.getRandomGroup(iconNodes, iconNum);
        typeRandom[2] = this.getRandomGroup(imageNodes, imageNum);
        typeRandom[3] = this.getRandomGroup(shapeNodes, shapeNum);

        let allGroups = [];
        for (let i = 0; i < typeNum; i++) {
            if (typeRandom[i] && typeRandom[i].length > 0) {
                allGroups.push(typeRandom[i]);
            }
        }

        // 进行不重复排列组合
        this.joinGroup(allGroups, 0, result_temp, result);
        // 转为一维数组组合
        result = this.transformToLinearArray(result);
        // 将组合里面不符合textNum,iconNum,imageNum,shapeNum的组合去掉
        result = this.removeErrorGroup(result, textNum, iconNum, imageNum, shapeNum);

        return result;
    },

    /**
     * 从arr数组中取出n个不重复元素的所有组合
     * @param {Array} 需要随机的数组
     * @param {Int} 组合里元素的个数
     * @return {Array}
     */
    getRandomGroup: function (arr, n) {
        if (!arr || arr.length == 0 || n <= 0 || n > arr.length) {
            return [];
        }

        let temp = [];
        let res = [];
        this.randomGroup(arr, n, 0, temp, 0, res);

        return res;
    },

    // 递归排列函数
    randomGroup: function (arr, n, begin, temp, index, result) {
        if (n == 0) { // 如果够n个数了
            let len = result.length;
            result[len] = [];

            temp.forEach(item => {
                result[len].push(item);
            });

            return;
        }

        for (let i = begin; i < arr.length; i++) {
            temp[index] = arr[i];
            this.randomGroup(arr, n - 1, i + 1, temp, index + 1, result);
        }
    },

    // 组合函数
    joinGroup: function (arr, index, result_temp, result) {
        if (!arr || arr.length == 0 || index < 0) {
            return;
        }

        if (index == arr.length) {
            let tmp = [];
            result_temp.forEach(item => {
                tmp.push(item);
            });
            result.push(tmp);

            return;
        }

        let group = arr[index];
        // 遍历元素进行组合
        for (let i = 0; i < group.length; i++) {
            let items = group[i];
            result_temp[index] = items;
            // 进入下一个流程
            this.joinGroup(arr, index + 1, result_temp, result);
        }
    },

    // 将二维数组转为一维
    transformToLinearArray: function (arr) {
        let res = [];
        arr.forEach((groups, index) => {
            res[index] = [];

            groups.forEach(items => {
                items.forEach(item => {
                    res[index].push(item);
                });
            });
        });

        return res;
    },

    // 将数组中, 删除不符合textNum + iconNum + imageNum + shapeNum 的组合
    removeErrorGroup: function (arr, textNum, iconNum, imageNum, shapeNum) {
        let res = [];
        if (!arr || arr.length == 0) {
            return res;
        }

        arr.forEach(item => {
            let txt = 0;
            let icon = 0;
            let image = 0;
            let shape = 0;

            item.forEach(obj => {
                switch (obj.type) {
                    case Common.QText:
                        txt++;
                        break;
                    case Common.QIcon:
                        icon++;
                        break;
                    case Common.QImage:
                        image++;
                        break;
                    case Common.QShape:
                        shape++;
                        break;
                    default:
                        ;
                }
            });

            if (txt == textNum && icon == iconNum && image == imageNum && shape == shapeNum) {
                res.push(item);
            }
        });

        return res;
    },

    /**
     * 给数组排序, 通过传入需要比较的值做比较
     * @param {Array} arr 需要比较数组
     * @param {String} param 需要比较的属性值
     * @param {Boolean} reverse 排序相反，默认由小到大
     */
    sortListByParam: function (arr, param, reverse) {
        if (!arr || arr.length == 0) {
            return;
        }

        // 直接使用冒泡
        let rev = false || reverse;
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                let valueA = param ? arr[j][param] : arr[j];
                let valueB = param ? arr[j + 1][param] : arr[j + 1];

                if (rev) { // 由大到小
                    if (valueA < valueB) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                } else { // 由小到大
                    if (valueA > valueB) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        }
    },


    // 屏幕输出组件信息
    logWidgetInfo: function (datas) {
        return;
        if (!datas || datas.length == 0) {
            return;
        }

        datas.forEach((data, index) => {
            // data类型为MatchData
            let result = data.getSimpleDataInLinearArray();
            result.forEach(res => {
                console.log('节点所属: ' + res.sign);
                console.log('节点id: ' + res.id);
                console.log('节点名称: ' + res.nodeName);
            });
            console.log('----------------------- one matched ' + index + ' -----------------------');
        });
    },

    // 屏幕输出元素信息
    logElementInfo: function (datas) {
        // 其实函数是通用的
        this.logWidgetInfo(datas);
    },

    /**
     * 将驼峰命名转为“-”分割的命名
     */
    nameLower(str) {
        return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
    },

    getRangeByNodes(nodes) {
        if (!nodes) {
            return {};
        }
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
        nodes.forEach((d, i) => {
            let height = d.height
            o.x = d.x < o.x ? d.x : o.x;
            o.y = d.y < o.y ? d.y : o.y;
            o.abX = d.abX < o.abX ? d.abX : o.abX;
            o.abY = d.abY < o.abY ? d.abY : o.abY;
            right = right < (d.abX + d.width) ? (d.abX + d.width) : right;
            bottom = bottom < (d.abY + d.height) ? (d.abY + d.height) : bottom;
        });
        o.height = bottom - o.abY;
        o.width = right - o.abX;
        return o;
    },
    gatherByLogic(domArr, logic) {
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
    },
    calRange(nodes) {
        if (!nodes) {
            return {};
        }
        let o = {
            abX: Number.POSITIVE_INFINITY,
            abY: Number.POSITIVE_INFINITY,
            abYops: Number.NEGATIVE_INFINITY,
            abXops: Number.NEGATIVE_INFINITY,
            width: 0,
            height: 0
        }
        nodes.forEach((d, i) => {
            o.abX = d.abX < o.abX ? d.abX : o.abX;
            o.abY = d.abY < o.abY ? d.abY : o.abY;
            o.abYops = o.abYops < d.abYops ? d.abYops : o.abYops;
            o.abXops = o.abXops < d.abXops ? d.abXops : o.abXops;
        });
        o.height = o.abYops - o.abY;
        o.width = o.abXops - o.abX;
        return o;
    },
    // 包含关系
    isWrap(outer, inner) {
        return this.isXWrap(outer, inner) && this.isYWrap(outer, inner);
    },
    // 在Y轴上是包含关系
    isYWrap(a, b) {
        return Math.abs((a.abY + a.abYops) / 2 - (b.abY + b.abYops) / 2) <=
            Math.abs(a.abYops - a.abY - b.abYops + b.abY) / 2
    },
    // 在X轴上是包含关系
    isXWrap(a, b) {
        return Math.abs((a.abX + a.abXops) / 2 - (b.abX + b.abXops) / 2) <=
            Math.abs(a.abXops - a.abX - b.abXops + b.abX) / 2
    },
    // 相连关系
    isConnect(a, b, dir = 0) {
        return this.isXConnect(a, b, dir) &&
            this.isYConnect(a, b, dir);
    },
    // 水平方向相连
    isXConnect(a, b, dir = 0) {
        const aCx = (a.abX + a.abXops) / 2,
            bCx = (b.abX + b.abXops) / 2;
        return Math.abs(aCx - bCx) <= (a.abXops - a.abX + b.abXops - b.abX) / 2 + dir;
    },
    // 垂直方向相连
    isYConnect(a, b, dir = 0) {
        const aCy = (a.abY + a.abYops) / 2,
            bCy = (b.abY + b.abYops) / 2;
        return Math.abs(aCy - bCy) <= (a.abYops - a.abY + b.abYops - b.abY) / 2 + dir;
    },
    /**
     * 是否垂直
     * 当doms数量只有一个,返回false
     */
    isVertical(arr, errorCoefficient = 0) {
        return !this.isHorizontal(arr, errorCoefficient);
        /* if (arr.length == 0) {
            return false;
        }
        let prev;
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        return arr.every(dom => {
            if (!prev) {
                prev = dom;
                return true;
            }
            let res = dom.abX < prev.abX + prev.width + errorCoefficient &&
                prev.abX < dom.abX + dom.width + errorCoefficient;
            prev = dom;
            return res;
        }) */
    },
    horizontalLogic(a, b, errorCoefficient) {
        if (
            // 如果水平方向相连
            this.isXConnect(a, b, errorCoefficient) &&
            // 如果垂直不包含
            !this.isYWrap(a, b)) {
            return false;
        }
        // return (a_abY < b_abY + b_height + errorCoefficient) &&
        // (b_abY < a_abY + a_height + errorCoefficient);
        return this.isYConnect(a, b, errorCoefficient);
    },
    /**
     * 是否水平
     * logic：若垂直方向不相交，则水平方向相交为水平
     * 若垂直方向相交，则水平方向互相包含则水平
     * 当doms数量只有一个,返回true
     */
    isHorizontal(doms, errorCoefficient = 0) {
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        let _ = this;
        return doms.every((a, i) => {
            return doms.every((b, j) => {
                return j <= i || _.horizontalLogic(a, b, errorCoefficient)
            })
        })
    }
};

module.exports = utils;