// import fs from 'fs';
import path from 'path';
import QLog from '../../dsl_helper/qlog';
import Store from '../../dsl_helper/store';
// 配置
import * as renderConfig from '../config.json';
// 此模块为h5解析模块
import Builder from '../builder';
import * as Style from './files/style';
import * as SimilarCssProcess from './dom/dom_similar_css';
import * as ClassName from './utils/className';

import LayoutCircle from '../../dsl_layout/layout/layouts/circle';
import LayoutClean from '../../dsl_layout/layout/clean';

// 模型
import modelList from './modelList';
// 模板
import tpl from './files/html';
import testTpl from './files/test_html';
const Loger = QLog.getInstance(QLog.moduleData.render);

const walkOut = function(layoutHandle: any, dslTree: any) {
  const { children } = dslTree;
  if (children.length <= 0) {
    return;
  }
  children.forEach((child: any) => {
    walkOut(layoutHandle, child);
  });
  return layoutHandle(dslTree, children);
};
class H5Builder extends Builder {
  similarCssMap: any;

  constructor(data: any, options: any) {
    var processDesc = '';
    try {
      processDesc = 'LayoutCircle';
      walkOut(LayoutCircle, data);
      processDesc = 'LayoutClean';
      data = walkOut(LayoutClean, data);
      processDesc = 'super';
      super(data, options, modelList.templateList);

      // 样式名解析
      processDesc = 'ClassName.process';
      ClassName.process(this.dom, ClassName.policy_oneName);
      // 样式节点解析
      processDesc = 'SimilarCssProcess.process';
      this.similarCssMap = SimilarCssProcess.process(this.dom);
    } catch (e) {
      console.error(`${__filename}\n${processDesc} error:${e}`);
    }
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

H5Builder.modelList = modelList.modelList;
H5Builder.widgetList = modelList.widgetList;
H5Builder.unionList = modelList.unionList;

export default H5Builder;
