// 样式的计算处理
import cssDom from '../dom_css';

import QLog from '../../../log/qlog';

// 生成的Css记录树

import cssProperty from './css_property';
import CssDom from './css_dom_tree';
import Func from './css_func';

const Loger = QLog.getInstance(QLog.moduleData.render);
const cssPropertyMap = cssProperty.map;

const walkout = (node: CssDom, handler: Function) => {
  if (!node.children || !node.children.length) return;
  const children = [...node.children];
  children.forEach(n => {
    walkout(n, handler);
    handler(n); // 处理节点
  });
  if (!node.parent) handler(node); // 处理根节点
};
const comboStyle = (node: CssDom) => {
  if (node.children.length) {
    cssPropertyMap.forEach((mod: any) => {
      const that: any = this;
      let { key } = mod;
      let x: any;
      if (Func.isExtend(key)) {
        //对比属性，是否具有相同的，有的话跑出来
        checkArraySame(node, key);
      }
    });
  }
};
//计算子节点内相同样式的权重。。权重最高的交由父类渲染，权重低的继续自己渲染
const checkArraySame = (node: any, key: string): any => {
  const tmp: { propName: string; value: any; count: number }[] = [];
  let domList: Array<CssDom> = node.children;
  domList.forEach((dom: any) => {
    let countKey = dom[key]
      ? dom[key]
      : dom.countStyle.add[key]
      ? dom.countStyle.add[key].value
      : null;
    if (countKey) {
      if (!tmp.length) {
        tmp.push({
          propName: key,
          value: countKey,
          count: 1,
        });
      } else {
        tmp.forEach((n: any) => {
          if (n.value === countKey) {
            n.count++;
          } else {
            tmp.push({
              propName: key,
              value: countKey,
              count: 1,
            });
          }
        });
      }
    }
  });
  if (!tmp.length) return null;
  tmp.sort(function(a, b) {
    return b.count - a.count;
  });

  //低段位的继续保留。高段位的上升到父类所有，同时给拥有高段位样式的节点标志好，后续需要不render这个样式，由父类继承而来。
  if (!node[key] || (node[key] && node[key] == tmp[0].value)) {
    if (!node[key]) {
      node.countStyle.add[key] = tmp[0];
    }
    domList.forEach((dom: any) => {
      if (
        (dom[key]
          ? dom[key]
          : dom.countStyle.add[key]
          ? dom.countStyle.add[key].value
          : null) == tmp[0].value
      ) {
        if (dom.countStyle.add[key]) {
          dom.countStyle.add[key] = null;
          delete dom.countStyle.add[key];
        }
        dom.countStyle.subtract[key] = tmp[0];
      }
    });
  }
};
class CssComboExtendTree {
  static countCombo(cssDomTree: CssDom) {
    walkout(cssDomTree, comboStyle);
  }
}

export default CssComboExtendTree;
