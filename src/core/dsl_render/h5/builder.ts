// import fs from 'fs';
import path from 'path';
import QLog from '../../dsl_layout/helper/qlog';
import Store from '../../dsl_layout/helper/store';
// 配置
import * as renderConfig from '../config.json';
// 此模块为h5解析模块
import Builder from '../builder';

import * as Style from './files/style';
import * as SimilarCssProcess from './dom/dom_similar_css';
import * as ClassName from './utils/className';
// 模板
import TemplateList from './templateList';
import ModelList from './models/modelList';
import WidgetList from './widgets/widgetList';
import tpl from './files/html';
import testTpl from './files/test_html';
const Loger = QLog.getInstance(QLog.moduleData.render);

class H5Builder extends Builder {
  similarCssMap: any;

  constructor(data: any, options: any) {
    super(data, options, TemplateList);
    // 样式名解析
    Loger.debug('render/h5/builder [ClassName.process]');
    // this._parseClassName();
    ClassName.process(this.dom, ClassName.policy_oneName);
    // 样式节点解析
    Loger.debug('render/h5/builder [SimilarCssProcess]');
    this.similarCssMap = SimilarCssProcess.process(this.dom);
  }

  getHtml() {
    let tplType = Store.get('tplType') || 0;
    let htmlStr = this.dom.getUI();
    let designWidth = Store.get('designWidth');
    // 添加完整的html结构
    let cssPath = path.relative(
      renderConfig.HTML.output.htmlPath,
      renderConfig.HTML.output.cssPath,
    );
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

  getStyle() {
    let simCss = SimilarCssProcess.getCssString(this.similarCssMap);
    let css = Style.getCssString(this.dom, this.similarCssMap);
    return simCss + css;
  }

  getResult() {
    return {
      uiString: this.getHtml(),
      styleString: this.getStyle(),
    };
  }
}

H5Builder.modelList = ModelList;
H5Builder.widgetList = WidgetList;

export default H5Builder;
