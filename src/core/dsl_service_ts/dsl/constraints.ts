// 这里定义我们的约束抽象
export default {
  /**
   * 自身相关描述
   */
  // 以x,y方式定位
  LayoutSelfPosition: {
    Static: 'Static',
    Absolute: 'Absolute',
  },
  // 排版中自身方式（优于父容器的排版）
  LayoutSelfHorizontal: {
    Left: 'Left',
    Right: 'Right',
  },
  // 排版中自身方式（优于父容器的排版）
  LayoutSelfVertical: {
    Top: 'Top',
    Bottom: 'Bottom',
  },
  // 固定高度
  LayoutFixedHeight: {
    Default: 'Default',
    Fixed: 'Fixed',
  },
  // 固定宽度
  LayoutFixedWidth: {
    Default: 'Default',
    Fixed: 'Fixed',
  },
  // flex:1
  LayoutFlex: {
    Default: 'Default',
    Auto: 'Auto',
    None: 'None',
  },
  /**
   * 父容器排版方式描述
   */
  // 父类中所有子类已x,y方式定位
  LayoutPosition: {
    Static: 'Static',
    Absolute: 'Absolute',
  },
  LayoutDirection: {
    Default: 'Default',
    Horizontal: 'Horizontal',
    Vertical: 'Vertical',
  },
  // 横轴从开头开始排
  LayoutJustifyContent: {
    Start: 'Start',
    End: 'End',
    Center: 'Center',
    // Between: 4
  },
  // 换行
  LayoutWrap: {
    Nowrap: 'Nowrap',
    Wrap: 'Wrap',
  },
  // 纵轴居开始
  LayoutAlignItems: {
    Start: 'Start',
    End: 'End',
    Center: 'Center',
  },
};
