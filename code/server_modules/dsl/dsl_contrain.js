// 这里定义我们的约束抽象
module.exports = {
    /**
     * 自身相关描述
     */
    // 以x,y方式定位
    LayoutSelfPosition: {
        Static: 1,
        Absolute: 2
    },
    // 排版中自身方式（优于父容器的排版）
    LayoutSelfHorizontal: {
        Left: 1,
        Right: 2
    },
    // 排版中自身方式（优于父容器的排版）
    LayoutSelfVertical: {
        Top: 1,
        Bottom: 2
    },
    // 文本左对齐
    LayoutAlign: {
        Left: 1,
        Right: 2,
        Center: 3
    },
    // 固定高度
    LayoutFixedHeight: {
        Default: 1,
        Fixed: 2
    },
    // 固定宽度
    LayoutFixedWidth: {
        Default: 1,
        Fixed: 2,
    },
    // flex:1
    LayoutFlex: {
        Default: 1,
        Auto: 2,
        None: 3,
    },
    /**
     * 父容器排版方式描述
     */
    // 父类中所有子类已x,y方式定位
    LayoutPosition: {
        Absolute: 1,
        Horizontal: 2,
        Vertical: 3,
    },
    // 横轴从开头开始排
    LayoutJustifyContent: {
        Start: 1,
        End: 2,
        Center: 3,
        // Between: 4
    },
    // 纵轴居开始
    LayoutAlignItems: {
        Start: 1,
        End: 2,
        Center: 3
    }
}