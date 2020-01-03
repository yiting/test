import Template from '../template';
export default class HtmlTemplate extends Template {
  className: string;
  tagName: string;
  constructor(dom: any) {
    super(dom);
  }
  textClassName(): string {
    let node = this.dom;
    if (node.styles.texts[0] && node.styles.texts[0].size > 30) {
      return 'title';
    }
    return 'text';
  }
  layerClassName(): string {
    let node = this.dom;
    let indexObj = {
      level: 0,
      layerLevel: 0,
    };
    getLayerLevel(node, indexObj);
    if (indexObj.level === 0) {
      return 'main';
    }
    if (indexObj.level === 1) {
      return 'section';
    }
    if (indexObj.level === 2) {
      return 'panel';
    }
    if (indexObj.layerLevel === 3) {
      return 'wrap';
    }
    if (indexObj.layerLevel === 4) {
      return 'box';
    }
    if (indexObj.layerLevel === 5) {
      return 'inner';
    }
    return 'block';
  }
  get classNameChain() {
    return [this.dom.className, this.dom.simClassName].join(' ');
  }
  get imgPath() {
    let path = this.dom.path;
    if (!path) {
      return '';
    }
    // return Path.join(
    // Path.relative(Config.HTML.output.htmlPath, Config.HTML.output.imgPath),
    // path,
    // );
    // const p = path.replace(/^.*\//gi, '');
    const p = path.split('/').pop();
    return `../images/${p}`;
  }
  get text() {
    return this.dom.text || '';
  }
}
function getLayerLevel(_node: any, _indexObj: any): any {
  const node: any = _node;
  const indexObj: any = _indexObj;
  if (!node.parent) {
    return null;
  }
  if (node.parent.modelName === 'Layer') {
    indexObj.layerLevel += 1;
  }
  indexObj.level += 1;
  const newLevel = getLayerLevel(node.parent, indexObj);
  return newLevel;
}
