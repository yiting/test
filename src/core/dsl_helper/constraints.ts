/**
 * 自身相关描述
 */
// 排版中自身方式（优于父容器的排版）
export enum LayoutSelfHorizontal {
  Left = 'Left',
  Right = 'Right',
  Default = 'Default',
}
// 排版中自身方式（优于父容器的排版）
export enum LayoutSelfVertical {
  Top = 'Top',
  Bottom = 'Bottom',
  Default = 'Default',
}
// flex=1
export enum LayoutFlex {
  Default = 'Default',
  Auto = 'Auto',
  None = 'None',
}
// 固定高度
export enum LayoutFixedHeight {
  Default = 'Default',
  Fixed = 'Fixed',
}
// 固定宽度
export enum LayoutFixedWidth {
  Default = 'Default',
  Fixed = 'Fixed',
}
/**
 * 父容器排版方式描述
 */
// 父类中所有子类已x,y方式定位
export enum LayoutPosition {
  Static = 'Static',
  Absolute = 'Absolute',
  Default = 'Default',
}
export enum LayoutDirection {
  Default = 'Default',
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}
// 横轴从开头开始排
export enum LayoutJustifyContent {
  Start = 'Start',
  End = 'End',
  Center = 'Center',
  Default = 'Default',
}
// 纵轴居开始
export enum LayoutAlignItems {
  Start = 'Start',
  End = 'End',
  Center = 'Center',
  Default = 'Default',
}
// 换行
export enum LayoutWrap {
  Nowrap = 'Nowrap',
  Wrap = 'Wrap',
  Default = 'Default',
}
