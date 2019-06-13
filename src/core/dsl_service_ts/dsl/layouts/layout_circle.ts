// 循环结构的逻辑处理模块
import Common from '../common';
import Utils from '../utils';
import Model from '../model';
import Group from '../group';
import Constraints from '../constraints';
import Similar from './layout_similar';

class LayoutCircle extends Model.LayoutModel {
  /**
   * 主流程：对传进来的模型数组进行循环分析处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   * @param {Int} layoutType 布局的类型
   */
  static handle(parent: any, nodes: any) {
    if (!nodes || nodes.length === 0) {
      // 如果没有子节点，则返回
      return;
    }
    // 找出需要对比的结构
    const compareNodes = LayoutCircle._filterCompare(nodes);
    // 找出相似结构组合
    const circleArr = LayoutCircle._findCircle(
      compareNodes,
      LayoutCircle._similarRule,
      null,
      // LayoutCircle._featureRule,
    );
    // 相似结构处理
    LayoutCircle._setCircle(parent, nodes, circleArr);
  }

  // 相似结构处理
  static _setCircle(_parent: any, _nodes: any, _circleArr: any) {
    const parent: any = _parent;
    let nodes: any = _nodes;
    const circleArr: any = _circleArr;
    if (circleArr.length === 0) {
      // 如果没有相似结构，则返回
      return;
    }
    const inSimilar: any[] = [];
    // 获取循环节点
    circleArr.forEach((item: any) => {
      // 如果特征多于一个，暂不处理
      if (item.feature !== 1) return;
      // 提取循环节点
      item.target.forEach((group: any) => inSimilar.push(...group));
      // 合并循环节点为新节点
      const newCycleData = Group.Tree.createCycleData(parent, item.target);
      // 加入新节点到父级元素
      nodes.push(newCycleData);
    });
    // 从节点中剔除被循环的节点
    nodes = nodes.filter((nd: any) => !inSimilar.includes(nd));
    parent.set('children', nodes);
  }

  // 剔除绝对定位元素，绝对定位元素不参与循环判断
  static _filterCompare(arr: any) {
    return arr.filter(
      (nd: any) =>
        nd.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute,
    );
  }

  /**
   * 特征规则
   */
  static _featureRule(fragment: any) {
    return fragment.length === 1;
  }

  // 相似节点逻辑
  static _similarRule(a: any, b: any) {
    return a._similarId && b._similarId && a._similarId === b._similarId;
    /*  return (
                         a._similarId &&
                         b._similarId &&
                         a._similarId===b._similarId
                     ) || (
                         a.type===Common.QText &&
                         (a.abY===b.abY ||
                             a.abYops===b.abYops ||
                             a.ctY===b.ctY ||
                             a.abX===b.abX ||
                             a.abXops===b.abXops ||
                             a.ctX===b.ctX)
                     ) */
  }

  /**
   * 相似性分组
   * @param {Array} arr 对比数组
   * @param {Function} similarLogic 相似逻辑
   * @param {Function} featureLogic 特征逻辑
   * 返回结构
   * [
   *  //组合类型
   *  [
   *      //该组合结果
   *      [
   *          //每个结果内容
   *      ],
   *      ...
   *  ],
   *  ...
   * ]
   */
  static _findCircle(
    arr: any,
    similarLogic: any,
    featureLogic: Function | null,
  ) {
    const pit: any[] = [];
    // 相似特征分组
    arr.forEach((s: any, i: any) => {
      // 开始遍历
      const lastIndex = i + 1;
      for (let index = 0; index < lastIndex; index++) {
        // 获取片段
        const fragment = arr.slice(index, lastIndex);
        if (featureLogic && !featureLogic(fragment)) {
          // 如果不符合特征逻辑
        } else if (
          // 排除完全重复的独立项
          fragment.length > 1 &&
          fragment.every(
            (t: any, j: any) =>
              j === 0 ||
              (similarLogic
                ? similarLogic(t, fragment[j - 1])
                : t === fragment[j - 1]),
          )
        ) {
          // 如果完全重复的独立项
        } else {
          // 判断重复片段
          const isRepeat = pit.some((_p: any) => {
            const p: any = _p;
            // existing:当前片段与缓存片段，每一段都符合逻辑特征判断
            const existing =
              p.feature === fragment.length &&
              //  只有一个特征时，还须连续的重复；多个特征时，只需逻辑相同
              p.target.some(
                (t: any) =>
                  (p.feature === 1 ? index === p.lastIndex + 1 : true) &&
                  t.every((f: any, fi: any) =>
                    similarLogic
                      ? similarLogic(f, fragment[fi])
                      : f === fragment[fi],
                  ),
              );

            if (existing && p.lastIndex + p.feature <= index) {
              // 如果重复，且当前节点在上一个重复片段的节点之后
              p.target.push(fragment);
              p.indexs.push(index);
              p.lastIndex = index;
              return true;
            }
            return false;
          });
          if (!isRepeat) {
            pit.push({
              feature: fragment.length,
              target: [fragment],
              indexs: [index],
              lastIndex: index,
            });
          }
        }
      }
    });
    const indexMap = new Array(arr.length);
    //  剔除不重复项
    const sorter = pit
      .filter(s => s.target.length > 1)
      //  按最高重复数，降序
      .sort((a, b) => b.target.length - a.target.length)
      // 按最大重复因子数， 降序
      .sort((a, b) => b.feature - a.feature)
      //  筛选已被选用的节点组
      .filter((s: any) => {
        const indexs: any[] = [];
        const sim: any = s;
        sim.target = sim.target.filter((target: any, idx: any) => {
          const index = sim.indexs[idx];
          //  提取序列组，检测重复组的序列是否已经被使用过
          if (
            indexMap.slice(index, index + sim.feature).every(i => i !== true)
          ) {
            indexs.push(index);
            return true;
          }
          return false;
        });
        //  剔除只有一个重复项的重复组
        if (sim.target.length > 1) {
          sim.indexs = indexs;
          indexs.forEach(index => {
            indexMap.fill(true, index, index + sim.feature);
          });
          return true;
        }
        return false;
      });
    return sorter;
  }
}

export default LayoutCircle;
