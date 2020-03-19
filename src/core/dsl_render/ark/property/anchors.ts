import * as Constraints from '../../../dsl_helper/constraints';

const HorMap: any = {
  Start: 1,
  Center: 3,
  End: 4,
};

const VerMap: any = {
  Start: 2,
  Center: 10,
  End: 8,
};
export default {
  key: 'anchors',
  value() {
    // return;
    if (!this.parent) {
      return null;
    }
    let anchors = 0;
    // 水平布局
    if (
      this.parent.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      if (
        this.parent.constraints.LayoutJustifyContent !==
        Constraints.LayoutJustifyContent.Center
      ) {
        anchors += HorMap[this.parent.constraints.LayoutJustifyContent];
      }
      if (
        this.parent.constraints.LayoutAlignItems !==
        Constraints.LayoutAlignItems.Center
      ) {
        anchors += VerMap[this.parent.constraints.LayoutAlignItems];
      }
    } else {
      if (
        this.parent.constraints.LayoutAlignItems !==
        Constraints.LayoutAlignItems.Center
      ) {
        anchors += HorMap[this.parent.constraints.LayoutAlignItems];
      }
      if (
        this.parent.constraints.LayoutJustifyContent !==
        Constraints.LayoutJustifyContent.Center
      ) {
        anchors += VerMap[this.parent.constraints.LayoutJustifyContent];
      }
    }
    return anchors;
  },
};
