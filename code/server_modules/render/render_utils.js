// 此模块用于定义一些在render模块包中用到的工具函数
const Constraints = require('../dsl2/dsl_constraints.js');
const utils = {
    /**
     * 将驼峰命名转为“-”分割的命名
     */
    nameLower: function (str) {
        return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
    },
    isVertical(arr, errorCoefficient = 0) {
        let prev;
        errorCoefficient = parseFloat(errorCoefficient) || 0;
        return arr.every(dom => {
            if (!prev) {
                prev = dom;
                return true;
            }
            let res = dom._abX < prev._abXops + errorCoefficient &&
                prev._abX < dom._abXops + errorCoefficient;
            prev = dom;
            return res;
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

}

module.exports = utils;