// 绝对布局处理

const Common = require('../dsl_common.js');
const Model = require('../dsl_model.js');


class LayoutAbsolute extends Model.LayoutModel {
    constructor(modelType) {
        super(modelType);
    }

    /**
     * 对传进来的模型数组进行处理
     * @param {Array} 模型数组 
     * @param {Int} 布局的类型
     */
    handle(models, layoutType) {
        if (this._modelType != layoutType) {
            return;
        }

        console.log('LayoutAbsolute');
    }
}


module.exports = LayoutAbsolute;