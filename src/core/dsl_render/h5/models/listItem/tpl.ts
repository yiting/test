import HtmlDom from '../../dom/dom';
import * as Constraints from '../../../../dsl_helper/constraints';

export default class ListItem extends HtmlDom {
  constructor(dom: any, parent: any) {
    super(dom, parent);
    this._orignClassName = listItemClassName(this);
    this._orignTagName = 'li';
  }
  getUI() {
    return `<li class="${this.htmlClassName}">${this.slot}</li>`;
  }
}

function listItemClassName(dom: HtmlDom): string {
  if (
    dom.parent &&
    dom.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
  ) {
    return 'grid-item';
  } else {
    return 'list-item';
  }
}
