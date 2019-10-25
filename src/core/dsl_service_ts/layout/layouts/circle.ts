// 循环结构的逻辑处理模块
import Utils from '../../helper/methods';
import Constraints from '../../helper/constraints';
import Similar from './similar';
import Store from '../../helper/store';
// import Tree from '../../group/tree';
import * as CircleBreak from './circle_break';
import * as CircleRepeat from './circle_repeat';
import * as CircleSerial from './circle_serial';
import { debug } from 'util';

class LayoutCircle {
  // 筛选前排序
  static _sort(parent: any, opt: any) {
    parent.children.sort((a: any, b: any) => a[opt] - b[opt]);
  }
  /**
   * 主流程：对传进来的模型数组进行循环分析处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   * @param {Int}  布局的类型
   */
  static handle(parent: any, nodes: any) {
    if (!nodes || nodes.length === 0) {
      // 如果没有子节点，则返回
      return;
    }
    // 子节点排序
    const isHorizontal = Utils.isHorizontal(nodes);
    if (isHorizontal) {
      LayoutCircle._sort(parent, 'abX');
    } else {
      LayoutCircle._sort(parent, 'abY');
    }
    /**
     * 多重循环
     */
    const circleBreakArr = LayoutCircle._findCircle(
      parent.children,
      CircleBreak.breakRule,
      CircleBreak.breakFeature,
      CircleBreak.breakFilter,
    );
    if (parent.id == 'D12ADFC8-86DF-469C-8F59-92BA914E5E91') debugger;
    CircleBreak.setBreakCircle(parent, circleBreakArr);
    if (isHorizontal) {
      LayoutCircle._sort(parent, 'abX');
    } else {
      LayoutCircle._sort(parent, 'abY');
    }
    /**
     * 系列结构
     */
    const serialArr = LayoutCircle._findCircle(
      parent.children,
      CircleSerial.repeatLogic,
      CircleSerial.featureLogic,
      CircleSerial.filterLogic,
    );
    CircleSerial.setSerialCircle(parent, serialArr);
    if (isHorizontal) {
      LayoutCircle._sort(parent, 'abX');
    } else {
      LayoutCircle._sort(parent, 'abY');
    }
    /**
     * 重复循环
     */
    const circleArr = LayoutCircle._findCircle(
      parent.children,
      CircleRepeat.repeatRule,
      null,
      CircleRepeat.repeatFilter,
    );
    // 相似结构处理
    CircleRepeat.setRepeatCircle(parent, circleArr);
    if (isHorizontal) {
      LayoutCircle._sort(parent, 'abX');
    } else {
      LayoutCircle._sort(parent, 'abY');
    }
  }
  /**
   * 相似性分组
   * @param {Array} arr 对比数组
   * @param {Function} repeatLogic 相似逻辑
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
    arr: any[],
    repeatLogic: Function | undefined = _baseRepeatLogic,
    featureLogic: Function | undefined,
    filterLogic: Function | undefined,
  ) {
    let fragmentCache: any[] = [];
    // 相似特征分组
    arr.forEach(function(s: any, i: any) {
      // 开始遍历
      let lastIndex = i + 1;
      for (let index = 0; index < lastIndex; index++) {
        // 获取片段
        let fragment = arr.slice(index, lastIndex);
        if (
          // 排除特征是完全相似的重复项
          fragment.length > 1 &&
          fragment.every(function(t: any, j: any) {
            return j === 0 || repeatLogic(t, fragment[j - 1]);
          })
        ) {
          // 不处理
        } else if (
          // 如果完全重复的独立项
          featureLogic &&
          !featureLogic(fragment)
        ) {
          // 如果不符合特征逻辑
        } else {
          // 如果重复片段符合逻辑，会进入当前环节
          // 判断重复片段
          let isRepeat = fragmentCache.some(function(_p: any) {
            let p: any = _p;
            // existing:当前片段与缓存片段，每一段都符合逻辑特征判断
            let existing =
              p.feature === fragment.length &&
              //  只有一个特征时，还须连续的重复；多个特征时，只需逻辑相同
              p.target.some(function(t: any) {
                return (
                  (p.feature === 1 ? index === p.lastIndex + 1 : true) &&
                  t.every(function(f: any, findex: any) {
                    return repeatLogic
                      ? repeatLogic(f, fragment[findex])
                      : f === fragment[findex];
                  })
                );
              });
            /**
             * 如果重复，且当前节点在上一个重复片段的节点之后
             */
            if (existing && p.lastIndex + p.feature <= index) {
              p.target.push(fragment);
              p.indexs.push(index);
              p.lastIndex = index;
              return true;
            }
            return false;
          });
          // 如果没有重复，则缓存当前片段
          if (!isRepeat) {
            fragmentCache.push({
              feature: fragment.length,
              target: [fragment],
              indexs: [index],
              lastIndex: index,
            });
          }
        }
      }
    });
    //  剔除不重复项
    let sorter = filterLogic(fragmentCache);
    //  筛选已被选用的节点组
    let pond: any[] = [];
    return sorter.filter(function(s: any) {
      let _cache: any = [];
      let res: any = s.target.every((target: any) => {
        let isInPond = target.some((t: any) => {
          return pond.includes(t);
        });
        _cache.push(...target);
        return !isInPond;
      });
      if (res) {
        pond.push(..._cache);
      }
      return res;
    });
  }
}

function _baseRepeatLogic(a: any, b: any) {
  return a === b;
}

export default LayoutCircle;
