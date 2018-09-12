// 这里定义我们的约束抽象
module.exports = {
    // 自身相关描述
    LayoutTopMargin: 1, // 上边距
    LayoutRightMargin: 2, // 右边距
    LayoutBottomMargin: 3, // 下边距
    LayoutLeftMargin: 4, // 左边距
    LayoutAlignSelfAbsolute: 5, // 以x,y方式定位
    LayoutAlignSelfStart: 6, // 排版中自身方式（优于父容器的排版）
    LayoutAlignSelfEnd: 7, // 排版中自身方式（优于父容器的排版）
    LayoutAlignSelfCenter: 8, // 排版中自身方式（优于父容器的排版）
    LayoutAutoHeight: 9, // 自适应高度
    LayoutAutoWidth: 10, // 自适应宽度

    // 父容器排版方式描述
    LayoutAbsolute: 20, // 父类中所有子类已x,y方式定位
    LayoutHorizontal: 21, // 水平方向排列(左>右)
    LayoutHorizontalReverse: 22, // 水平方向排列(右>左)
    LayoutVertical: 23, // 垂直方向排列(上>下)
    LayoutVerticalReverse: 24, // 垂直方向排列(下>上)
    LayoutJustifyContentStart: 25, // 横轴从开头开始排
    LayoutJustifyContentEnd: 26, // 横轴从结尾开始排
    LayoutJustifyContentCenter: 27, // 横轴排在中间
    LayoutJustifyContentBetween: 28, // 横轴排在两端
    LayoutAlignItemsStart: 40, // 纵轴居开始
    LayoutAlignItemsEnd: 41, // 纵轴居结尾
    LayoutAlignItemsCenter: 42, // 纵轴居中

    // 更高级的排版描述，快速排版
    // 就是上面两类约束的组合
    // 需要更多计算来实现转换的逻辑
    LayoutSpacingDefault: 50, // | - obj - obj - obj - |
    LayoutSpacingInside: 51, // |obj - obj - obj|
    LayoutSpacingWeighted: 52, // |objjjjj objjjjjjjjjjjjjjjjjj objj|
    LayoutSpacingPacked: 53, // | - - - - obj obj obj - - - - |
    LayoutSpacingPackedBias: 54 // | - - obj obj obj - - - - - - |
}