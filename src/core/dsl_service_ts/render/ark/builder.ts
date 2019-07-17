// import fs from 'fs';
import path from 'path';

// 此模块为h5解析模块
import Builder from '../builder';
import Dom from './dom';
import QLog from '../../log/qlog';
import Store from '../../helper/store';

import * as renderConfig from '../config.json';

const Loger = QLog.getInstance(QLog.moduleData.render);

class ArkBuilder extends Builder {
  _htmlFile: any;

  htmlDom: any;

  cssDom: any;

  // 解析逻辑
  _parseData() {
    Loger.debug('h5_builder.js [_parseHtml]');
    this._parseHtml();
  }

  // 解析html
  _parseHtml() {
    this.htmlDom = Dom.process(this._data);
  }

  getTagString() {
    const htmlStr = Dom.getXmlString(this.htmlDom);
    return htmlStr;
  }

  getStyleString() {
    return '';
  }
}

export default ArkBuilder;
