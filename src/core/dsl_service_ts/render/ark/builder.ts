// 此模块为h5解析模块
import Builder from '../builder';
import View from './view';
import Resource from './resource';
import QLog from '../../log/qlog';
import DomSupplementConstraints from '../helper/supplementConstraints';
import DomBoundary from '../helper/boundary';
import TextRevise from '../helper/textRevise';

import FileComProj from './files/com_proj';
import FileFontXML from './files/font_xml';
import FileViewXML from './files/view_xml';
import FileViewLua from './files/view_lua';
import FileConfig from './files/config.json';

const Loger = QLog.getInstance(QLog.moduleData.render);

class ArkBuilder extends Builder {
  view: any;
  resource: any;
  // 解析逻辑
  _parseData() {
    Loger.debug('render/ark/builder [_parse]');
    this._parse();

    // 计算约束
    Loger.debug('render/ark/builder [DomConstraints]');
    DomSupplementConstraints(this.view);

    // 调整边距
    Loger.debug('render/ark/builder [DomBoundary]');
    DomBoundary(this.view);

    // 计算字体对齐方式
    Loger.debug('render/ark/builder [TextRevise]');
    TextRevise(this.view);
  }

  // 解析html
  _parse() {
    this.view = View.process(this._data);
    this.resource = Resource.process(this._data);
  }

  getResult() {
    const resouceList = this.resource.imageList;
    const fontMap = this.resource.fontMap;
    const view_xml = View.getXmlString(this.view);
    return {
      com_proj: FileComProj(resouceList),
      font_xml: FileFontXML(fontMap),
      view_xml: FileViewXML(view_xml),
      view_lua: FileViewLua(this.view.width, this.view.height),
      // json: this.view.toJSON(),
    };
  }
}

export default ArkBuilder;
