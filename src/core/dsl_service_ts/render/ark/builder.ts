// 此模块为h5解析模块
import Builder from '../builder';
import Dom from './dom';
import Resource from './resource';
import QLog from '../../log/qlog';
import CssConstraints from '../helper/constraints';
import CssBoundary from '../helper/boundary';
import TextRevise from '../helper/textRevise';

const Loger = QLog.getInstance(QLog.moduleData.render);

class ArkBuilder extends Builder {
  _htmlFile: any;

  dom: any;
  resource: any;
  // 解析逻辑
  _parseData() {
    Loger.debug('render/ark/builder [_parseXml]');
    this._parseXml();

    this._parseResource();

    // 计算约束
    Loger.debug('render/ark/builder [CssConstraints]');
    CssConstraints(this.dom);

    // 调整边距
    Loger.debug('render/ark/builder [CssBoundary]');
    CssBoundary(this.dom);

    Loger.debug('render/ark/builder [TextRevise]');
    TextRevise(this.dom);
  }

  // 解析html
  _parseXml() {
    this.dom = Dom.process(this._data);
  }
  _parseResource() {
    this.resource = new Resource(this._data);
  }

  getResult() {
    return {
      font: this.resource.getFontString(),
      xml: Dom.getXmlString(this.dom),
      json: this.dom.toJSON(),
    };
  }
}

export default ArkBuilder;
