// import fs from 'fs';
import path from 'path';

// 此模块为h5解析模块
import Builder from '../builder';
import * as Style from './style';
import * as Html from './html';
import * as SimilarCssProcess from './model/dom_similar_css';
import * as ClassName from './utils/className';
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

  similarCssMap: any;

  // 解析逻辑
  _parseData() {
    Loger.debug('render/h5/builder.js [_parseClassName]');
    this._parseClassName();

    Loger.debug('render/h5/builder.js [_parseCss]');
    this._parseCss();

    Loger.debug(
      `render/h5/builder.js [_parseHtml] time: ${Date.parse(
        new Date().toString(),
      )}`,
    );
    this._parseHtml();
    Loger.debug(
      `render/h5/builder.js [_parseDataOver] time: ${Date.parse(
        new Date().toString(),
      )}`,
    );
  }

  /**
   * 编译节点样式名
   * @param {TemplateData} data
   */
  _parseClassName() {
    ClassName.process(this._data, ClassName.policy_oneName);
  }

  // 解析html
  _parseHtml() {
    this.htmlDom = Html.process(this._data, this.cssDom, this.similarCssMap);
  }

  // 解析样式
  _parseCss() {
    this.cssDom = Style.process(this._data);
    this.similarCssMap = SimilarCssProcess.process(this.cssDom);
  }

  getTagString() {
    const tplType = Store.get('tplType') || 0;
    const htmlStr = Html.getHtmlString(this.htmlDom);
    const designWidth = Store.get('designWidth');
    // 添加完整的html结构
    const cssPath = path.relative(
      renderConfig.HTML.output.htmlPath,
      renderConfig.HTML.output.cssPath,
    );
    if (tplType == -1) {
      // 测试
      return testTpl(htmlStr, {
        designWidth,
      });
    }
    if (tplType == 0) {
      // 正式
      return tpl(htmlStr, {
        designWidth,
      }).replace(/\{cssFilePath\}/gim, cssPath);
    }
    // 模块
    return htmlStr;
  }

  getStyleString() {
    // StyleSheets(this.cssDom, this.similarCssMap);
    let _styleString = SimilarCssProcess.getCssString(this.similarCssMap);
    _styleString += Style.getCssString(this.cssDom, this.similarCssMap);
    return _styleString;
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
