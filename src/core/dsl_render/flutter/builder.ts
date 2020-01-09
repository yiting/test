// 此模块为h5解析模块
import Builder from '../builder';
import QLog from '../../dsl_layout/helper/qlog';

// dom
import FileConfig from './files/config.json';
import ModelList from './models/modelList';
import TemplateList from './templateList';
import Main_dart from './files/main.dart';

const Loger = QLog.getInstance(QLog.moduleData.render);

class FlutterBuilder extends Builder {
  // 解析逻辑
  constructor(data: any, options: any) {
    Loger.debug('render/flutter/builder [_parse]');
    super(data, options, TemplateList);
  }

  getResult() {
    let code = this.dom.getUI();
    return {
      main_dart: Main_dart(code),
    };
  }
}
FlutterBuilder.modelList = ModelList;
FlutterBuilder.widgetList = [];
export default FlutterBuilder;
