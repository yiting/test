import HtmlDom from '../../dom/dom';
import * as Constraints from '../../../../dsl_helper/constraints';

export default class Layer extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.layerClassName();
    this._orignTagName = 'div';
  }
  getUI() {
    return `<div class="${this.htmlClassName}">${this.slot}</div>`;
  }
  layerClassName() {
    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return 'row';
    }
    if (
      this.parent &&
      this.parent.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Horizontal
    ) {
      return 'col';
    }
    return 'block';
  }
}
