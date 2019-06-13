// 此模块用于定义一些在render模块包中用到的工具函数
const Constraints = require('../dsl/dsl_constraints.js');
const utils = {
    /**
     * 将驼峰命名转为“-”分割的命名
     */
    nameLower: function (str) {
        return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
    },
    // 包含关系
    isWrap(outer, inner, dir = 0) {
        return this.isXWrap(outer, inner, dir) && this.isYWrap(outer, inner, dir);
    },
    // 在Y轴上是包含关系
    isYWrap(a, b, dir = 0) {
        return Math.abs((a._abY + a._abYops) / 2 - (b._abY + b._abYops) / 2) <=
            Math.abs(a._abYops - a._abY - b._abYops + b._abY) / 2 + dir
    },
    // 在X轴上是包含关系
    isXWrap(a, b, dir = 0) {
        return Math.abs((a._abX + a._abXops) / 2 - (b._abX + b._abXops) / 2) <=
            Math.abs(a._abXops - a._abX - b._abXops + b._abX) / 2 + dir
    },
    // 相连关系
    isConnect(a, b, dir = 0) {
        return this.isXConnect(a, b, dir) &&
            this.isYConnect(a, b, dir);
    },
    // 水平方向相连
    isXConnect(a, b, dir = 0) {
        const aCx = (a._abX + a._abXops) / 2,
            bCx = (b._abX + b._abXops) / 2;
        return Math.abs(aCx - bCx) <= (a._abXops - a._abX + b._abXops - b._abX) / 2 + dir;
    },
    // 垂直方向相连
    isYConnect(a, b, dir = 0) {
        const aCy = (a._abY + a._abYops) / 2,
            bCy = (b._abY + b._abYops) / 2;
        return Math.abs(aCy - bCy) <= (a._abYops - a._abY + b._abYops - b._abY) / 2 + dir;
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
            let res = dom._abX < prev._abX + prev.width + errorCoefficient &&
                prev._abX < dom._abX + dom.width + errorCoefficient;
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
    },
    // 计算六维基线
    calculateBaseLine(parent) {
        let X = 0,
            Y = 0,
            Xops = 0,
            Yops = 0,
            Xctr = 0,
            Yctr = 0,
            pXctr = (parent._abX + parent._abXops) / 2,
            pYctr = (parent._abY + parent._abYops) / 2,
            nodeCount = 0;
        const errorCoefficient = 2; // 误差系数
        parent.children.forEach(node => {
            if (node.constraints['LayoutSelfPosition'] == Constraints.LayoutSelfPosition.Absolute) {
                // 剔除绝对定位
                return;
            }
            nodeCount++;
            X += Math.abs(node._abX - parent._abX);
            Y += Math.abs(node._abY - parent._abY);
            Xops += Math.abs(parent._abXops - node._abXops);
            Yops += Math.abs(parent._abYops - node._abYops);
            Xctr += Math.abs(pXctr - (node._abX + node._abXops) / 2);
            Yctr += Math.abs(pYctr - (node._abY + node._abYops) / 2);
        });
        let hStart = Math.abs(X / nodeCount) < errorCoefficient,
            hCenter = Math.abs(Xctr / nodeCount) < errorCoefficient,
            hEnd = Xops / nodeCount == 0,
            vStart = Math.abs(Y / nodeCount) < errorCoefficient,
            vCenter = Math.abs(Yctr / nodeCount) < errorCoefficient,
            vEnd = Yops / nodeCount == 0;

        const horizontalCenter = hCenter && !hStart && !hEnd,
            horizontalEnd = hEnd && !hStart,
            horizontalStart = !horizontalCenter && !horizontalEnd,
            verticalCenter = vCenter && !vStart && !vEnd,
            verticalEnd = vEnd && !vStart,
            verticalStart = !verticalCenter && !verticalEnd;

        return {
            horizontalStart,
            horizontalCenter,
            horizontalEnd,
            verticalStart,
            verticalCenter,
            verticalEnd,
        }

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
            o._abX = d._abX < o._abX ? d._abX : o._abX;
            o._abY = d._abY < o._abY ? d._abY : o._abY;
            o._abYops = o._abYops < d._abYops ? d._abYops : o._abYops;
            o._abXops = o._abXops < d._abXops ? d._abXops : o._abXops;
        });
        o.height = o._abYops - o._abY;
        o.width = o._abXops - o._abX;
        return o;
    }

}

module.exports = utils;