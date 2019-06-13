// import fs from 'fs';
import path from 'path';

// 此模块为h5解析模块
import Common from '../../dsl/common';
import Builder from '../builder';
import CssDom from './css_dom';
import SimilarCssDom from './similar_css_dom';
import HtmlDom from './html_dom';
import ClassName from './class_name';
import QLog from '../../log/qlog';

import Store from '../../helper/store';

import tplString from './tpl';
import testTplString from './test_tpl';
import * as renderConfig from '../config.json';

const Loger = QLog.getInstance(QLog.moduleData.render);

class H5Builder extends Builder {
  _htmlFile: any;

  _testFile: any;

  _layoutType: any;

  htmlDom: any;

  cssDom: any;

  similarCssArr: any;

  /* constructor(data: any, _options: any) {
        super(data, _options);
        // try {
        //     // html
        //     const tplHtmlPath = path.join(__dirname, 'tpl.html');
        //     this._htmlFile = fs.readFileSync(tplHtmlPath, 'utf-8');
        //     // test html
        //     const tplTestPath = path.join(__dirname, 'test_tpl.html');
        //     this._testFile = fs.readFileSync(tplTestPath, 'utf-8');
        // } catch (e) {
        //     Loger.error(`h5/builder.js [constructor]:${e}`);
        // }
    } */

  // 解析逻辑
  _parseData() {
    Loger.debug('h5_builder.js [_parseClassName]');
    this._parseClassName();

    Loger.debug('h5_builder.js [_parseCss]');
    this._parseCss();

    Loger.debug('h5_builder.js [_parseHtml]');
    this._parseHtml();
  }

  /**
   * 编译节点样式名
   * @param {TemplateData} data
   */
  _parseClassName() {
    ClassName.process(this._data, ClassName.threeSegmentsClass);
  }

  // 解析html
  _parseHtml() {
    const cssMap = CssDom.getCssMap(this.cssDom);
    const similarCssMap = this.similarCssArr;
    this.htmlDom = HtmlDom.process(this._data, cssMap, similarCssMap);
  }

  // 解析样式
  _parseCss() {
    this.cssDom = CssDom.process(this._data, this._layoutType);
    this.similarCssArr = SimilarCssDom.process(this.cssDom);
  }

  getTagString() {
    const htmlStr = HtmlDom.getHtmlString(this.htmlDom, this._layoutType);

    // 添加完整的html结构
    const tpl = this._getTpl();
    const cssPath = path.relative(
      renderConfig.HTML.output.htmlPath,
      renderConfig.HTML.output.cssPath,
    );
    const result = tpl
      .replace(/%\{cssPath\}/gim, cssPath)
      .replace(/%\{htmlStr\}/gim, htmlStr);
    return result;
  }

  getStyleString() {
    this._styleString = '';
    this._styleString += SimilarCssDom.getCssString(this.similarCssArr);
    this._styleString += CssDom.getCssString(this.cssDom, this.similarCssArr);
    return this._styleString;
  }

  // 获取h5模板
  _getTpl() {
    const isLocalTest = Store.get('isLocalTest');
    if (isLocalTest) {
      return testTplString;
    }
    return tplString;
  }
}

export default H5Builder;
