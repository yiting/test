import Path from 'path';

import Template from '../template';
import XmlEngine from '../XmlEngine';
import Layer from '../../template/html/base/layer';

export default class HtmlTemplate extends Template {
  requireImgPath: (path: string) => string;

  textClassName: (node: any) => string;

  layerClassName: (node: any) => string;

  constructor(...args: any[]) {
    super(args);
    this._engine = XmlEngine;
    this._template = '';

    this.requireImgPath = function(path: string) {
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
    };

    this.textClassName = function(node: any): string {
      if (node.styles.texts[0] && node.styles.texts[0].size > 30) {
        return 'title';
      }
      return 'text';
    };

    this.layerClassName = function(node: any): string {
      const indexObj = {
        level: 0,
        layerLevel: 0,
      };
      HtmlTemplate.getLayerLevel(node, indexObj);
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
    };
  }

  static getLayerLevel(_node: any, _indexObj: any): any {
    const node: any = _node;
    const indexObj: any = _indexObj;
    if (!node.parent) {
      return null;
    }
    if (node.parent.modelName === Layer.name) {
      indexObj.layerLevel += 1;
    }
    indexObj.level += 1;
    const newLevel = HtmlTemplate.getLayerLevel(node.parent, indexObj);
    return newLevel;
  }
}
