// 此模块为h5解析模块
const Common = require('../../dsl/dsl_common.js');
const Builder = require('../builder');
const CssDom = require('./css_dom');
const SimilarCssDom = require('./similar_css_dom');
const HtmlDom = require('./html_dom');
const fs = require('fs');
const path = require('path');

const QLog = require('../../../log/qlog');
const Loger = QLog.getInstance(QLog.moduleData.render);

let tpl = {
  html: null,
  test: null,
};

let htmlDom,
  cssDomTree,
  similarCssArr,
  _domCache,
  _classCache,
  _similarClassCache;
class H5Builder extends Builder {
  constructor(data, layoutType) {
    super(data, layoutType);
    // html
    let tplHtmlPath = path.join(__dirname, 'tpl.html');
    tpl.html = fs.readFileSync(tplHtmlPath, 'utf-8');
    // test html
    let tplTestPath = path.join(__dirname, 'test_tpl.html');
    tpl.test = fs.readFileSync(tplTestPath, 'utf-8');
  }

  // 解析逻辑
  _parseData() {
    _domCache = {};
    _classCache = {};
    _similarClassCache = {};

    Loger.debug(`h5_builder.js [_parseClassName]`);
    this._parseClassName(this._data);

    Loger.debug(`h5_builder.js [_parseCss]`);
    this._parseCss();

    Loger.debug(`h5_builder.js [_parseHtml]`);
    this._parseHtml();
  }
  /**
   * 编译节点样式名
   * @param {TemplateData Tree} data
   */
  _parseClassName(data) {
    try {
      /**
       * 特性节点命名
       */
      let selfPrefix = '';
      let modelNode = _domCache[data.modelId],
        parentNode = _domCache[data.parentId];
      let selfClassName = data.tplAttr.class || data.tagName;
      // 如果模型id为当前id， 即为模型跟节点， 不使用模型样式链模式
      if (data.modelId != data.id && modelNode) {
        selfPrefix = modelNode.selfClassName;
        selfClassName = modelNode.tplAttr.class + '-' + selfClassName;
        let className = [selfPrefix, selfClassName].join(' ');
        selfClassName = _classCache[className]
          ? selfClassName + data.serialId
          : selfClassName;
        data.selfClassName = selfClassName;
        data.selfCssName = [selfPrefix, selfClassName];
      } else if (parentNode) {
        // 如果有父节点，则使用父节点样式链模式
        selfPrefix = parentNode.selfClassName;
        if (_domCache[parentNode.parentId]) {
          selfClassName = parentNode.tplAttr.class + '-' + selfClassName;
        }
        let className = [selfPrefix, selfClassName].join(' ');
        // 如果存在样式，则加后缀
        selfClassName = _classCache[className]
          ? selfClassName + data.serialId
          : selfClassName;
        data.selfClassName = selfClassName;
        data.selfCssName = [selfPrefix, selfClassName];
      } else if (!parentNode) {
        // 如果没有副节点（说明当前节点为结构跟节点），则使用自身样式名
        data.selfClassName = selfClassName;
        data.selfCssName = [selfClassName];
      } else {
        // 否则，使用自身样式名+序列值（序列值是树的唯一值）
        data.selfClassName = selfClassName + data.serialId;
        data.selfCssName = [selfClassName + data.serialId];
      }
      // 缓存样式链
      _classCache[data.selfCssName.join(' ')] = true;

      /**
       * 相似节点命名
       */
      if (_similarClassCache[data.similarId]) {
        // 如果相似节点已经有缓存样式链，直接使用该样式链
        data.similarClassName =
          _similarClassCache[data.similarId].similarClassName;
        data.similarCssName = _similarClassCache[data.similarId].similarCssName;
      } else if (data.similarId) {
        // 如果有相似节点
        let similarPrefix = '',
          similarParent = _domCache[data.similarParentId],
          similarClassName = '_' + (data.tplAttr.class || data.tagName);
        if (similarParent) {
          // 如果有similarParent，即该相似节点为某相似节点的子节点，使用相似节点样式链
          similarPrefix = similarParent.similarClassName;
          similarClassName =
            similarParent.tplAttr.class + '_' + similarClassName;
          let className = [similarPrefix, similarClassName].join(' ');
          similarClassName = _classCache[className]
            ? similarClassName + data.similarId
            : similarClassName;
          data.similarClassName = similarClassName;
          data.similarCssName = [similarPrefix, similarClassName];
        } else {
          // 否则为相似节点跟节点，使用当前跟节点样式名+相似值（相似列唯一值）
          data.similarClassName = similarClassName + data.similarId;
          data.similarCssName = [similarClassName + data.similarId];
        }

        _similarClassCache[data.similarId] = {
          similarClassName: data.similarClassName,
          similarCssName: data.similarCssName,
        };
        _classCache[data.similarCssName.join(' ')] = true;
      }
      // 缓存节点
      _domCache[data.id] = data;
      // 遍历下一层
      data.children.forEach(d => {
        this._parseClassName(d);
      });
    } catch (e) {
      Loger.error(
        `h5_builder.js [_parseClassName] ${e},params:[data.id:${data &&
          data.id}]`,
      );
    }
  }

  // 解析html
  _parseHtml() {
    htmlDom = HtmlDom.process(
      this._data,
      CssDom.getCssMap(cssDomTree),
      similarCssArr,
      this._layoutType,
    );
  }

  // 解析样式
  _parseCss() {
    cssDomTree = CssDom.process(this._data, this._layoutType);
    // similarCssArr = {};
    similarCssArr = SimilarCssDom.process(cssDomTree, this._layoutType);
  }

  getTagString() {
    this._tagString = HtmlDom.getHtmlString(htmlDom, this._layoutType);
    return this._tagString;
  }
  getStyleString() {
    this._styleString =
      SimilarCssDom.getCssString(similarCssArr, this._layoutType) +
      CssDom.getCssString(cssDomTree, similarCssArr, this._layoutType);
    return this._styleString;
  }

  // 获取h5模板
  _getTpl() {
    if (this._layoutType == Common.TestLayout) {
      return tpl.test;
    }
    return tpl.html;
  }
}

module.exports = H5Builder;
