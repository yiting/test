// 样式的计算处理
import cssDom from './dom_css';

import QLog from '../../log/qlog';

// 生成的Css记录树

import cssProperty from './css_property';

const Loger = QLog.getInstance(QLog.moduleData.render);
const cssPropertyMap = cssProperty.map;
const minCss: [] = [];

class SimilarCssDom {
  static _cssDomTree: any;

  static process(cssDomTree: any) {
    Loger.debug(
      `similar_css_dom.js [process],enter[cssDomTree:${cssDomTree &&
        cssDomTree.id}]`,
    );

    this._cssDomTree = cssDomTree;
    const _similarMap = {};
    // 遍历节点，构建similar元素
    Loger.debug('similar_css_dom.js [_buildSimilarData]');
    this._buildSimilarData(this._cssDomTree, _similarMap);

    Loger.debug('similar_css_dom.js [_buildSimilarCss]');
    this._buildSimilarCss(_similarMap);
    return _similarMap;
  }

  static getCssString(_similarMap: any) {
    Loger.debug(
      `similar_css_dom.js [getCssString],enter[_similarMap:${_similarMap &&
        Object.keys(_similarMap)}]`,
    );
    const css: any[] = [];
    Object.keys(_similarMap).forEach(key => {
      const cssNode = _similarMap[key];
      const className = this._getClass(cssNode);
      const cssStr = this._getCssProperty(cssNode.css);
      css.push(`${className}{${cssStr}}`);
    });
    return css.join('\n');
  }

  /**
   * 重复样式命名规则，待写
   */
  static _getClass(cssNode: any) {
    return cssNode.similarCssName.map((n: any) => `.${n}`).join(' ');
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
  static _getCssProperty(cssNode: any) {
    const props: any = [];
    Object.keys(cssNode).forEach(key => {
      const value = cssNode[key];
      if (value !== null && value !== undefined) {
        props.push(cssDom.CssDom.getCssProperty(key, value));
      }
    });
    return props.join(';');
  }

  /**
   * 构建相似节点数据集
   * @param {*} cssNode
   */
  static _buildSimilarData(cssNode: any, _similarMap: any) {
    const similarMap: any = _similarMap;
    try {
      // 如果存在相似节点，则存储相似节点到simialrData
      const { similarId } = cssNode;
      if (similarId) {
        if (!similarMap[similarId]) {
          similarMap[similarId] = {
            modelId: cssNode.modelId,
            similarId,
            similarParentId: cssNode.similarParentId,
            similarCssName: cssNode.similarCssName,
            css: {},
            list: [],
          };
        }
        similarMap[similarId].list.push(cssNode);
        if (
          similarMap[similarId].className &&
          similarMap[similarId].className === cssNode.tplAttr.class
        ) {
          similarMap[similarId].className = null;
        }
      }
      cssNode.children.forEach((nd: any) =>
        this._buildSimilarData(nd, similarMap),
      );
    } catch (e) {
      Loger.error(
        `similar_css_dom.js [_buildSimilarData] ${e},params[cssNode.id:${
          cssNode.id
        },cssNode.similarId:${cssNode.similarId}]`,
      );
    }
  }

  static _buildSimilarCss(_similarMap: any) {
    const similarMap: any = _similarMap;
    try {
      Object.keys(similarMap).forEach(sid => {
        // console.log(sid)
        const cssDomList = similarMap[sid].list;

        const cssObj: any = {};
        cssDomList.forEach((_cssDom: any) => {
          cssPropertyMap.forEach((mod: any) => {
            const { key } = mod;
            if (cssObj[key] === undefined) {
              cssObj[key] = [];
            }
            cssObj[key].push(_cssDom[key]);
          });
          minCss.forEach(key => {
            if (cssObj[key] === undefined) {
              cssObj[key] = [];
            }
            cssObj[key].push(_cssDom[key]);
          });
        });
        cssPropertyMap.forEach((mod: any) => {
          const { key } = mod;
          similarMap[sid].css[key] = this._setcssPropertyMap(cssObj[key]);
        });
        minCss.forEach(key => {
          similarMap[sid].css[key] = this._setMinCss(cssObj[key]);
        });
      });
    } catch (e) {
      Loger.error(`similar_css_dom.js [_buildSimilarCss] ${e}`);
    }
  }

  static _setMinCss(cssArr: any[]) {
    const s = cssArr.filter(value => typeof value === 'number');
    return Math.min(...s);
  }

  static _setcssPropertyMap(cssArr: any[]) {
    // return (target===undefined || target===source) ? source : null;
    const o: any = {};
    cssArr.forEach(value => {
      if (!o[value]) {
        o[value] = {
          v: value,
          c: 0,
        };
      }
      o[value].c += 1;
    });
    let max = 0;
    let maxValue;
    Object.keys(o).forEach(value => {
      if (o[value].c > max) {
        max = o[value].c;
        maxValue = o[value].v;
      }
    });
    return maxValue;
  }

  static _mergeSimilarCSS(target: any, source: any) {}
}

export default SimilarCssDom;
