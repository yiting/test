// 模块用于管理及初始化布局模型实例
// 
// 布局模型的核心思想是根据布局路径去分析, 每个模型根据布局方式选择是否去处理
// layout_absolute -> 不需后续处理
// layout_fixed -> 不需后续处理
// layout_flex -> layout_equality -> layout_between

const Common = require('../dsl_common.js');
const LayoutAbsolute = require('./layout_absolute.js');
const LayoutFixed = require('./layout_fixed.js');
const LayoutFlex = require('./layout_flex.js');
const LayoutEquality = require('./layout_equality.js');
const LayoutBetween = require('./layout_between.js');


const MODEL_LIST = [
    new LayoutAbsolute(Common.AbsoluteLayout),
    new LayoutFixed(Common.FixedLayout),
    new LayoutFlex(Common.FlexLayout),
    new LayoutEquality(Common.FlexLayout),
    new LayoutBetween(Common.FlexLayout)
];

module.exports = MODEL_LIST;
