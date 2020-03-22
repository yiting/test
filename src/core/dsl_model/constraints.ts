import * as Cons from '../dsl_helper/constraints';
// 这里定义我们的约束抽象
export default class Constraints {
  LayoutSelfHorizontal: Cons.LayoutSelfHorizontal;
  LayoutSelfVertical: Cons.LayoutSelfVertical;
  LayoutFlex: Cons.LayoutFlex;
  LayoutFixedHeight: Cons.LayoutFixedHeight;
  LayoutFixedWidth: Cons.LayoutFixedWidth;
  LayoutPosition: Cons.LayoutPosition;
  LayoutDirection: Cons.LayoutDirection;
  LayoutJustifyContent: Cons.LayoutJustifyContent;
  LayoutAlignItems: Cons.LayoutAlignItems;
  LayoutWrap: Cons.LayoutWrap;
  constructor(o: any = {}) {
    this.LayoutSelfHorizontal =
      o.LayoutSelfHorizontal || Cons.LayoutSelfHorizontal.Default;
    this.LayoutSelfVertical =
      o.LayoutSelfVertical || Cons.LayoutSelfVertical.Default;
    this.LayoutFlex = o.LayoutFlex || Cons.LayoutFlex.Default;
    this.LayoutFixedHeight =
      o.LayoutFixedHeight || Cons.LayoutFixedHeight.Default;
    this.LayoutFixedWidth = o.LayoutFixedWidth || Cons.LayoutFixedWidth.Default;
    this.LayoutPosition = o.LayoutPosition || Cons.LayoutPosition.Default;
    this.LayoutDirection = o.LayoutDirection || Cons.LayoutDirection.Default;
    this.LayoutJustifyContent =
      o.LayoutJustifyContent || Cons.LayoutJustifyContent.Default;
    this.LayoutAlignItems = o.LayoutAlignItems || Cons.LayoutAlignItems.Default;
    this.LayoutWrap = o.LayoutWrap || Cons.LayoutWrap.Default;
  }
}
