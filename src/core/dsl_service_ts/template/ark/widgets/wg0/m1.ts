import ArkTemplate from '../../arkTemplate';

class LAYER extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<View size="${this.width},${this.height}"></View>`;
  }
}

export default LAYER;
