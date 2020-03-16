// 样式的计算处理
import CssDom from './dom';
import QLog from '../../../dsl_helper/qlog';
import Func from '../utils/css_func';

// 生成的Css记录树
import {
  map as cssPropertyMap,
  inheritProperty as cssInheritProperty,
  defaultProperty as cssDefaultProperty,
} from './propertyMap';

let Loger = QLog.getInstance(QLog.moduleData.render);
let minCss: [] = [];

let _cssDomTree: any = {};

export function process(cssDomTree: any) {
  Loger.debug(
    `similar_css_dom.js [process],enter[cssDomTree:${cssDomTree &&
      cssDomTree.id}]`,
  );

  _cssDomTree = cssDomTree;
  let _similarMap = {};
  // 遍历节点，构建similar元素
  Loger.debug('similar_css_dom.js [_buildSimilarData]');
  _buildSimilarData(_cssDomTree, _similarMap);

  Loger.debug('similar_css_dom.js [_buildSimilarCss]');
  _buildSimilarCss(_similarMap);
  return _similarMap;
}

export function getCssString(_similarMap: any) {
  const css: any[] = [];
  Object.keys(_similarMap).forEach(key => {
    const cssNode = _similarMap[key];
    const className = _getClass(cssNode);
    const cssStr = _getCssProperty(cssNode.css);
    css.push(`${className}{${cssStr}}`);
  });
  return css.join('\n');
}

/**
 * 重复样式命名规则，待写
 */
function _getClass(cssNode: any) {
  return cssNode.simClassNameChain.map((n: any) => `.${n}`).join(' ');
}
/**
 * 输出样式属性
 * @param {Node} cssNode
 */
function _getCssProperty(cssNode: any) {
  let props: any = [];
  Object.keys(cssNode).forEach(key => {
    let value = cssNode[key];
    let compValue = value + '';
    let defVal = cssDefaultProperty[key] + '';
    if (compValue !== defVal) {
      props.push(Func.transCssValue(key, value));
    }
  });
  return props.join(';');
}

/**
 * 构建相似节点数据集
 * @param {*} cssNode
 */
function _buildSimilarData(cssNode: any, _similarMap: any) {
  const similarMap: any = _similarMap;
  try {
    // 如果存在相似节点，则存储相似节点到simialrData
    const { similarId } = cssNode;
    if (similarId) {
      if (!similarMap[similarId]) {
        similarMap[similarId] = {
          similarId,
          simClassNameChain: cssNode._simClassNameChain,
          css: {},
          list: [],
        };
      }
      similarMap[similarId].list.push(cssNode);
    }
    cssNode.children.forEach((nd: any) => _buildSimilarData(nd, similarMap));
  } catch (e) {
    Loger.error(
      `similar_css_dom.js [_buildSimilarData] ${e},params[cssNode.id:${
        cssNode.id
      },cssNode.similarId:${cssNode.similarId}]`,
    );
  }
}

function _buildSimilarCss(_similarMap: any) {
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
        similarMap[sid].css[key] = _setcssPropertyMap(cssObj[key]);
      });
      minCss.forEach(key => {
        similarMap[sid].css[key] = _setMinCss(cssObj[key]);
      });
    });
  } catch (e) {
    Loger.error(`similar_css_dom.js [_buildSimilarCss] ${e}`);
  }
}

function _setMinCss(cssArr: any[]) {
  const s = cssArr.filter(value => typeof value === 'number');
  return Math.min(...s);
}

function _setcssPropertyMap(cssArr: any[]) {
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
