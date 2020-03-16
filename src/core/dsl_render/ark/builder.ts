// 此模块为h5解析模块
import Builder from '../builder';
import Resource from './resource';

import FileComProj from './files/com_proj';
import FileFontXML from './files/font_xml';
import FileViewXML from './files/view_xml';
import FileViewLua from './files/view_lua';
import FileConfig from './files/config.json';
import TemplateList from './templateList';
// 模型，模板
import ModelList from './models/modelList';

class ArkBuilder extends Builder {
  view: any;
  resource: any;
  constructor(data: any, options: any) {
    super(data, options, TemplateList);
    this.view = this.dom.getUI();
    this.resource = Resource.process(this.dom);
  }

  getResult() {
    const resouceList = this.resource.imageList;
    const fontMap = this.resource.fontMap;
    const view_xml = this.view;
    return {
      com_proj: FileComProj(resouceList),
      font_xml: FileFontXML(fontMap),
      view_xml: FileViewXML(view_xml),
      view_lua: FileViewLua(this.view.width, this.view.height),
      // json: this.view.toJSON(),
    };
  }
}
ArkBuilder.modelList = ModelList;
ArkBuilder.widgetList = [];

export default ArkBuilder;
