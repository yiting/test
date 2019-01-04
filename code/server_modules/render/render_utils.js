// 此模块用于定义一些在render模块包中用到的工具函数
//
const utils = {
    /**
     * 将驼峰命名转为“-”分割的命名
     */
    nameLower: function(str) {
        return str.replace(/([A-Z])/mg, '-$1').toLowerCase();
    }

}

module.exports = utils;
