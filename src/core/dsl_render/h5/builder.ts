// import fs from 'fs';
import path from 'path';
import QLog from '../../dsl_service_ts/helper/qlog';
import Store from '../../dsl_service_ts/helper/store';
// 配置
import * as renderConfig from '../config.json';
// 此模块为h5解析模块
import Builder from '../builder';
import * as Style from './files/style';
import * as SimilarCssProcess from './model/dom_similar_css';
import * as ClassName from './utils/className';
//
import TextRevise from '../helper/textRevise';
import ReviseDomTree from '../helper/reviseDomTree';
import Dom from './model/dom';
// 模板
import Template from '../template';
import TemplateList from './templateList';
import tpl from './files/html';
import testTpl from './files/test_html';
import { debug } from 'util';
const Loger = QLog.getInstance(QLog.moduleData.render);

class H5Builder extends Builder {
  _htmlFile: any;

  htmlDom: any;

  dom: any;

  similarCssMap: any;

  // 解析逻辑
  _parseData() {
    // 构建树
    Loger.debug('render/h5/dom_css [_buildTree]');
    this.dom = _buildTree(null, this._data);

    Loger.debug('render/h5/dom_css [ReviseDomTree]');
    ReviseDomTree(this.dom);

    Loger.debug('render/h5/dom_css [TextRevise]');
    TextRevise(this.dom);
    // 解析节点className
    // 样式名解析
    Loger.debug('render/h5/builder.js [_parseClassName]');
    // this._parseClassName();
    ClassName.process(this.dom, ClassName.policy_oneName);
    // 样式节点解析
    Loger.debug('render/h5/builder.js [_parseCss]');
    this.similarCssMap = SimilarCssProcess.process(this.dom);
  }

  getHtml() {
    let tplType = Store.get('tplType') || 0;
    let htmlStr = Template.getUI(this.dom.template);
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
/**
 * 构建cssDom树
 * @param {Object} parent
 * @param {Json} data
 */
function _buildTree(parent: any, data: any) {
  let dom: any;
  try {
    let Tpl = TemplateList.find(
      (temp: any) => temp.name === data.constructor.name,
    );
    dom = new Dom(data, parent);
    dom.template = new Tpl(dom);
    // 构建树
    if (parent) {
      parent.children.push(dom);
    }
    data.children.forEach((d: any) => {
      _buildTree(dom, d);
    });
  } catch (e) {
    Loger.error(`${__dirname} [_buildTree]: ${e}`);
  }
  return dom;
}
export default H5Builder;
