// 此模块为h5解析模块
import Builder from '../builder';
import QLog from '../../dsl_service_ts/helper/qlog';

// dom
import TextRevise from '../helper/textRevise';
import ReviseDomTree from '../helper/reviseDomTree';
import FlutterDom from './model/dom';

import FileConfig from './files/config.json';
import Template from '../template';
import TemplateList from './templateList';
import LayerTemplate from '../../dsl_model/models/layer/tpl/flutter';
import Main_dart from './files/main.dart';
import { debug } from 'util';

const Loger = QLog.getInstance(QLog.moduleData.render);

class FlutterBuilder extends Builder {
  resource: any;
  dom: any;
  // 解析逻辑
  _parseData() {
    Loger.debug('render/flutter/builder [_parse]');
    this.dom = _buildTree(this._data, null);
    // 计算边距
    Loger.debug('render/flutter/builder [ReviseDomTree]');
    ReviseDomTree(this.dom);
    // 计算字体对齐方式
    Loger.debug('render/flutter/builder [TextRevise]');
    TextRevise(this.dom);
    // 解析
  }

  getResult() {
    let code = Template.getUI(this.dom.template);
    return {
      main_dart: Main_dart(code),
    };
  }
}

/**
 * 构建xmlDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(data: any, parent: any) {
  let dom: any;
  try {
    let Tpl = TemplateList.find(
      (temp: any) => temp.name === data.constructor.name,
    );
    if (!Tpl) {
      Tpl = LayerTemplate;
    }
    dom = new FlutterDom(data, parent);
    dom.template = new Tpl(dom);

    // 构建树
    if (parent) {
      parent.children.push(dom);
    }
    data.children.forEach((child: any) => {
      _buildTree(child, dom);
    });
  } catch (e) {
    Loger.error(`${__dirname} [_buildTree] ${e}`);
  }
  return dom;
}
export default FlutterBuilder;
