// 样式的计算处理
const CssDom = require('./css_dom').CssDom;

const QLog = require('../../../log/qlog');
const Loger = QLog.getInstance(QLog.moduleData.render);

// 生成的Css记录树

let cssPropertyMap = require('./css_property').map,
  minCss = [];

class similarCssDom {
  static process(cssDomTree, layoutType) {
    Loger.debug(
      `similar_css_dom.js [process],enter[cssDomTree:${cssDomTree &&
        cssDomTree.id}]`,
    );

    this._cssDomTree = cssDomTree;
    let _similarMap = {};
    // 遍历节点，构建similar元素
    Loger.debug(`similar_css_dom.js [_buildSimilarData]`);
    this._buildSimilarData(this._cssDomTree, _similarMap);

    Loger.debug(`similar_css_dom.js [_buildSimilarCss]`);
    this._buildSimilarCss(_similarMap);
    return _similarMap;
  }
  static getCssString(_similarMap) {
    Loger.debug(
      `similar_css_dom.js [getCssString],enter[_similarMap:${_similarMap &&
        Object.keys(_similarMap)}]`,
    );

    let css = [];
    Object.keys(_similarMap).forEach(key => {
      let cssNode = _similarMap[key];
      let className = this._getClass(cssNode);
      let cssStr = this._getCssProperty(cssNode.css);
      css.push(`${className}{${cssStr}}`);
    });
    return css.join('\n');
  }
  /**
   * 重复样式命名规则，待写
   */
  static _getClass(cssNode) {
    return cssNode.similarCssName.map(n => '.' + n).join(' ');
  }
  /* static _getClass(cssNode) {
        let parentClassName = '',
            selfClassName = ''

        if (cssNode.similarParentId) {
            parentClassName = '.sim' + cssNode.similarParentId;
        }

        if (cssNode.similarId) {
            selfClassName = '.sim' + cssNode.similarId;
        }

        if (parentClassName) {
            return [parentClassName, selfClassName].join(' ');
        } else {
            return selfClassName;
        }
    } */
  /**
   * 输出样式属性
   * @param {Node} cssNode
   */
  static _getCssProperty(cssNode) {
    let props = [];
    Object.keys(cssNode).forEach(key => {
      let value = cssNode[key];
      if (value !== null && value !== undefined) {
        props.push(CssDom.getCssProperty(key, value));
      }
    });
    return props.join(';');
  }
  /**
   * 构建相似节点数据集
   * @param {*} cssNode
   */
  static _buildSimilarData(cssNode, _similarMap) {
    try {
      // 如果存在相似节点，则存储相似节点到simialrData
      let similarId = cssNode.similarId;
      if (similarId) {
        if (!_similarMap[similarId]) {
          _similarMap[similarId] = {
            modelId: cssNode.modelId,
            similarId: similarId,
            similarParentId: cssNode.similarParentId,
            similarCssName: cssNode.similarCssName,
            css: {},
            list: [],
          };
        }
        _similarMap[similarId].list.push(cssNode);
        if (
          _similarMap[similarId].className &&
          _similarMap[similarId].className == cssNode.tplAttr.class
        ) {
          _similarMap[similarId].className = null;
        }
      }
      cssNode.children.forEach(nd => this._buildSimilarData(nd, _similarMap));
    } catch (e) {
      Loger.error(
        `similar_css_dom.js [_buildSimilarData] ${e},params[cssNode.id:${
          cssNode.id
        },cssNode.similarId:${cssNode.similarId}]`,
      );
    }
  }

  static _buildSimilarCss(_similarMap) {
    try {
      Object.keys(_similarMap).forEach(sid => {
        let cssDomList = _similarMap[sid].list;

        let cssObj = {};
        cssDomList.forEach(cssDom => {
          cssPropertyMap.forEach(key => {
            if (cssObj[key] == undefined) {
              cssObj[key] = [];
            }
            cssObj[key].push(cssDom[key]);
          });
          minCss.forEach(key => {
            if (cssObj[key] == undefined) {
              cssObj[key] = [];
            }
            cssObj[key].push(cssDom[key]);
          });
        });
        cssPropertyMap.forEach(key => {
          _similarMap[sid].css[key] = this._setcssPropertyMap(cssObj[key]);
        });
        minCss.forEach(key => {
          _similarMap[sid].css[key] = this._setMinCss(cssObj[key]);
        });
      });
    } catch (e) {
      Loger.error(`similar_css_dom.js [_buildSimilarCss] ${e}`);
    }
  }

  static _setMinCss(cssArr) {
    let s = cssArr.filter(value => {
      return typeof value == 'number';
    });
    return Math.min(...s);
  }
  static _setcssPropertyMap(cssArr) {
    // return (target == undefined || target == source) ? source : null;
    let o = {};
    cssArr.forEach(value => {
      if (!o[value]) {
        o[value] = {
          v: value,
          c: 0,
        };
      }
      o[value].c++;
    });
    let max = 0,
      maxValue;
    Object.keys(o).forEach(value => {
      if (o[value].c > max) {
        max = o[value].c;
        maxValue = o[value].v;
      }
    });
    return maxValue;
  }

  static _mergeSimilarCSS(target, source) {}
}

module.exports = similarCssDom;
