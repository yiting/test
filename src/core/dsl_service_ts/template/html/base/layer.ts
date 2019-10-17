import HtmlTemplate from '../htmltemplate';

class Layer extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<div :class="layerClassName()"></div>';
  }
}

export default Layer;
