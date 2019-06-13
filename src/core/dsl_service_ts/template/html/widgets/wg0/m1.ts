import HtmlTemplate from '../../htmlTemplate';

class LAYER extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = '<div :class="layerClassName()"></div>';
  }
}

export default LAYER;
