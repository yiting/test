// 此模块为h5解析模块
import Builder from '../builder';
import View from './view';
import Resource from './resource';
import QLog from '../../log/qlog';
import DomConstraints from '../helper/constraints';
import DomBoundary from '../helper/boundary';
import TextRevise from '../helper/textRevise';

import FileConfig from './files/config.json';
import FileComProj from './files/com_proj';
import FileFontXML from './files/font_xml';
import FileViewXML from './files/view_xml';

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
    DomConstraints(this.view);

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
    // const font = FileFontXML.
    const fileList = Resource.formatPath(FileConfig);
    const imageList = this.resource.imageList;
    const resouceList = fileList.concat(imageList);
    const fontMap = this.resource.fontMap;
    const view_xml = View.getXmlString(this.view);
    return {
      com_proj: FileComProj(resouceList),
      font_xml: FileFontXML(fontMap),
      view_xml: FileViewXML(view_xml),
      json: this.view.toJSON(),
    };
  }
}

export default ArkBuilder;
