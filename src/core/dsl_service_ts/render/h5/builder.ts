// import fs from 'fs';
import path from 'path';

// 此模块为h5解析模块
import Builder from '../builder';
import CssDom from './style';
import * as SimilarCssProcess from './model/dom_similar_css';
import HtmlDom from './html';
import {
  process as ClassNameProcess,
  policy_oneName as ClassNamePolicy,
} from './utils/className';
import QLog from '../../log/qlog';

import Store from '../../helper/store';

import tpl from './tpl';
import testTpl from './test_tpl';
import * as renderConfig from '../config.json';
const Loger = QLog.getInstance(QLog.moduleData.render);

class H5Builder extends Builder {
  _htmlFile: any;

  htmlDom: any;

  cssDom: any;

  similarCssArr: any;

  // 解析逻辑
  _parseData() {
    Loger.debug('render/h5/builder.js [_parseClassName]');
    this._parseClassName();

    Loger.debug('render/h5/builder.js [_parseCss]');
    this._parseCss();

    Loger.debug('render/h5/builder.js [_parseHtml]');
    this._parseHtml();
  }

  /**
   * 编译节点样式名
   * @param {TemplateData} data
   */
  _parseClassName() {
    ClassNameProcess(this._data, ClassNamePolicy);
  }

  // 解析html
  _parseHtml() {
    const cssMap = CssDom.getCssMap(this.cssDom);
    const similarCssMap = this.similarCssArr;
    this.htmlDom = HtmlDom.process(this._data, cssMap, similarCssMap);
  }

  // 解析样式
  _parseCss() {
    this.cssDom = CssDom.process(this._data);
    this.similarCssArr = SimilarCssProcess.process(this.cssDom);
  }

  getTagString() {
    let tplType = Store.get('tplType') || 0;
    let htmlStr = HtmlDom.getHtmlString(this.htmlDom);
    let designWidth = Store.get('designWidth');
    // 添加完整的html结构
    let cssPath = path.relative(
      renderConfig.HTML.output.htmlPath,
      renderConfig.HTML.output.cssPath,
    );
    console.log(renderConfig, cssPath);
    if (tplType == -1) {
      // 测试
      return testTpl(htmlStr, {
        designWidth: designWidth,
      });
    } else if (tplType == 0) {
      // 正式
      return tpl(htmlStr, {
        designWidth: designWidth,
      }).replace(/\{cssFilePath\}/gim, cssPath);
    } else {
      // 模块
      return htmlStr;
    }
  }

  getStyleString() {
    this._styleString = '';
    this._styleString += SimilarCssProcess.getCssString(this.similarCssArr);
    this._styleString += CssDom.getCssString(this.cssDom, this.similarCssArr);
    return this._styleString;
  }

  getResult() {
    return {
      uiString: this.getTagString(),
      styleString: this.getStyleString(),
    };
  }

  // 获取h5模板
  _getTpl() {
    const isLocalTest = Store.get('isLocalTest');
    if (isLocalTest) {
      return testTpl;
    }
    return tpl;
  }
}

export default H5Builder;
