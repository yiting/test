import HtmlDom from '../../dom/dom';
import * as Constraints from '../../../../dsl_helper/constraints';

export default class List extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = this.listClassName();
    this._orignTagName = 'ul';
  }
  getUI() {
    return `<ul class="${this.htmlClassName}">${this.slot}</ul>`;
  }

  listClassName(): string {
    if (
      this.constraints.LayoutDirection == Constraints.LayoutDirection.Horizontal
    ) {
      return 'grid';
    } else {
      return 'list';
    }
  }
}
