// 此模块为h5解析模块
import Builder from '../builder';
import QLog from '../../dsl_layout/helper/qlog';

// dom
import ModelList from './models/modelList';
import TemplateList from './models/templateList';
import output from './files/output';

const Loger = QLog.getInstance(QLog.moduleData.render);

class NewBuilder extends Builder {
  // 解析逻辑
  constructor(data: any, options: any) {
    Loger.debug('render/flutter/builder [_parse]');
    super(data, options, TemplateList);
  }

  getResult() {
    let code = this.dom.getUI();
    return {
      output: output(code),
    };
  }
}
NewBuilder.modelList = ModelList;
NewBuilder.widgetList = [];
export default NewBuilder;
