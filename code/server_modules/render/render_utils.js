// 此模块用于定义一些在render模块包中用到的工具函数
//
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

}

module.exports = utils;
