// 循环结构的逻辑处理模块
import Common from '../common';
import Utils from '../utils';
import Model from '../model';
import Group from '../group';
import Constraints from '../constraints';
import Similar from './layout_similar';

const CYCLE_MODEL_NAME = 'cycle-01';

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
    /**
     * 待改进：如何避免重复循环的出现
     */
    const circleInnerArr = LayoutCircle._findCircle(
      parent.children,
      LayoutCircle._innerSimilarRule,
      LayoutCircle._innerFeatureRule,
      LayoutCircle._innerFilter,
    );
    LayoutCircle._setInnerCircle(parent, circleInnerArr);
    // 找出相似结构组合
    const circleArr = LayoutCircle._findCircle(
      parent.children,
      LayoutCircle._similarRule,
      null,
      LayoutCircle._similarFilter,
    );
    // 相似结构处理
    LayoutCircle._setCircle(parent, circleArr);
  }

  static _innerSimilarRule(a: any, b: any) {
    return a._similarId && b._similarId && a._similarId === b._similarId;
  }
  static _innerFilter(result: any) {
    return result
      .filter((s: any) => s.target.length > 0)
      .sort((a: any, b: any) => {
        // 先按最多重复次数，降序
        // 相同次数，按最多重复因子数， 降序
        const s = b.target.length - a.target.length;
        if (s == 0) {
          return b.feature - a.feature;
        }
        return s;
      });
  }
  // 打破循环的特征规则
  static _innerFeatureRule(feature: any) {
    // 特征数大于2
    if (feature.length < 2) {
      return false;
    }
    return feature.every((node: any, index: number) => {
      const child: any = node.children[0];
      if (
        // 剔除绝对定位元素，绝对定位元素不参与判断
        node.constraints['LayoutSelfPosition'] ==
          Constraints.LayoutSelfPosition.Absolute ||
        // 只有一个子节点
        node.children.length !== 1 ||
        // 子节点都是循环节点
        child.modelName !== CYCLE_MODEL_NAME
      ) {
        return false;
      }
      if (index === 0) {
        return true;
      }
      // 子循环节点的循环数量一致
      const prev: any = feature[index - 1].children[0];
      if (Object.keys(prev.nodes).length !== Object.keys(child.nodes).length) {
        return;
      }
      // 子循环节点的循环位置相同
      return Object.keys(child.nodes).every((_ref: any) => {
        const l = child.nodes[_ref];
        const n = prev.nodes[_ref];
        return (
          l._abX === n._abX ||
          l._abY === n._abY ||
          // 末节点对齐
          l._abXops === n._abXops ||
          l._abYops === n._abYops ||
          //中线对齐
          l._abX + l._abXops === n._abX + n._abXops ||
          l._abY + l._abYops === n._abY + n._abYops
        );
      });
    });
  }
  // 设置内循环处理
  static _setInnerCircle(_parent: any, _circleArr: any) {
    _circleArr.forEach((fragment: any) => {
      let rowSimilarIndex: number = 0;
      if (fragment.target.length > 1) {
        Similar.similarIndex += 1;
        rowSimilarIndex = Similar.similarIndex;
      }
      Similar.similarIndex += 1;
      const itemSimilarIndex = Similar.similarIndex;
      fragment.target.forEach((group: any) => {
        // 获取引用值
        const references = Object.keys(group[0].children[0].nodes);
        // 构建新组合
        const target: any = {};
        references.forEach((key: any) => {
          group.forEach((cycle: any) => {
            if (!target[key]) {
              target[key] = [];
            }
            target[key].push(cycle.children[0].nodes[key]);
          });
        });
        // 删除节点中旧节点
        const children = _parent.children.filter(
          (nd: any) => !group.includes(nd),
        );
        // 对新组合构建包含结构
        const newChild = Object.keys(target).map((key: string) => {
          const _group = target[key];
          const newParent = Group.Tree.createNodeData(null);
          _group.forEach((child: any) => {
            child.set('parentId', newParent.id);
          });
          newParent.set('parentId', _parent.id);
          newParent.set('children', _group);
          newParent.set('similarId', itemSimilarIndex);
          newParent.resize();
          return [newParent];
        });
        const newCycleParent = Group.Tree.createNodeData(null);
        const newCycleData = Group.Tree.createCycleData(
          newCycleParent,
          newChild,
        );
        newCycleParent.set('children', [newCycleData]);
        if (rowSimilarIndex) {
          newCycleParent.set('similarId', rowSimilarIndex);
        }
        newCycleParent.resize();
        // 如果父节点为跟节点，则不能宽于父节点
        if (_parent.type === Common.QBody) {
          newCycleParent.set('abX', _parent.abX);
          newCycleParent.set('abXops', _parent.abXops);
        }
        // 加入新节点到父级元素
        children.push(newCycleParent);
        _parent.set('children', children);
      });
    });
  }
  // 相似结构处理
  static _setCircle(_parent: any, _circleArr: any) {
    const that = this;
    const circleArr: any = _circleArr;
    if (circleArr.length === 0) {
      // 如果没有相似结构，则返回
      return;
    }
    circleArr.forEach((frame: any) => {
      /**
       * 如果循环片段是一个特征的，在寻找时已经时相连的
       * */
      if (frame.feature === 1) {
        // 判断是否内嵌循环
        const isWrapItems = frame.target.every((target: any) => {
          return (
            target[0].children.length == 1 &&
            target[0].children[0].modelName == CYCLE_MODEL_NAME
          );
        });
        if (isWrapItems) {
          that._setWrapCircle(_parent, frame.target);
        } else {
          that._setULCircle(_parent, frame.target);
        }
      } else {
        /**
         * 如果循环片段是多个特征的
         */
        that._setWrapBlock(_parent, frame.target);
      }
    });
  }
  // 循环特征规则
  static _featureRule(feature: any) {
    return feature.every((node: any, index: number) => {
      return (
        // 剔除绝对定位元素，绝对定位元素不参与判断
        node.constraints['LayoutSelfPosition'] !==
        Constraints.LayoutSelfPosition.Absolute
      );
    });
  }
  // 设置循环结构
  static _setULCircle(_parent: any, _target: any) {
    const { children } = _parent;
    const inSimilar: any[] = [];
    // 获取循环节点
    _target.forEach((item: any) => {
      // 提取循环节点
      inSimilar.push(...item);
    });
    // 合并循环节点为新节点
    const newCycleData = Group.Tree.createCycleData(_parent, _target);
    // 加入新节点到父级元素
    children.push(newCycleData);
    // 从节点中剔除被循环的节点
    const newChildren = children.filter((nd: any) => !inSimilar.includes(nd));
    _parent.set('children', newChildren);
  }
  // 设置换行循环结构
  static _setWrapCircle(_parent: any, _target: any) {
    const inWrap: any = [];
    const inRemove: any = [];
    const itemIndex: number = 0; // 默认单节点循环索引值为0
    let { children } = _parent;
    _target.forEach((node: any) => {
      Object.keys(node[itemIndex].children[itemIndex].nodes).forEach(
        (key: any) => {
          const item = node[itemIndex].children[itemIndex].nodes[key];
          inWrap.push([item]);
        },
      );
      inRemove.push(...node);
    });
    // 合并循环节点为新节点
    const newCycleParent = Group.Tree.createNodeData(null);
    const newCycleData = Group.Tree.createCycleData(newCycleParent, inWrap);
    newCycleData.constraints['LayoutWrap'] = Constraints.LayoutWrap.Wrap;
    newCycleParent.set('children', [newCycleData]);
    newCycleParent.resize();
    const gap = inWrap[1][0].abX - inWrap[0][0].abXops;
    newCycleData.set('abX', newCycleData.abX - gap);
    // 加入新节点到父级元素
    children.push(newCycleParent);
    // 从节点中剔除被循环的节点
    children = children.filter((nd: any) => !inRemove.includes(nd));
    _parent.set('children', children);
  }
  static _setWrapBlock(_parent: any, _target: any) {
    const { children } = _parent;
    const inRemove: any = [];
    Similar.similarIndex += 1;
    const similarId: any = Similar.similarIndex;

    _target.forEach((group: any) => {
      const newWrapData = Group.Tree.createNodeData(null);
      newWrapData.set('children', group);
      newWrapData.set('parentId', _parent.id);
      newWrapData.set('similarId', similarId);
      newWrapData.resize(false);
      inRemove.push(...group);
      children.push(newWrapData);
    });
    // 从节点中剔除被循环的节点
    const newChildren = children.filter((nd: any) => !inRemove.includes(nd));
    _parent.set('children', newChildren);
  }
  // 相似节点逻辑
  static _similarRule(a: any, b: any) {
    return a._similarId && b._similarId && a._similarId === b._similarId;
  }

  static _similarFilter(result: any) {
    return result
      .filter((s: any) => s.target.length > 1)
      .sort((a: any, b: any) => {
        // 先按最多重复次数，降序
        // 相同次数，按最多重复因子数， 降序
        const s = b.target.length - a.target.length;
        if (s == 0) {
          return b.feature - a.feature;
        }
        return s;
      });
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
    _arr: any,
    _similarLogic: any,
    _featureLogic: any,
    _filterLogic: any,
  ) {
    const arr: any = _arr;
    const fragmentCache: any[] = [];
    const filterLogic: any = _filterLogic;
    // 相似特征分组
    arr.forEach(function(s: any, i: any) {
      const similarLogic: any = _similarLogic;
      const featureLogic: any = _featureLogic;
      // 开始遍历
      const lastIndex = i + 1;
      for (let index = 0; index < lastIndex; index++) {
        // 获取片段
        const fragment = arr.slice(index, lastIndex);
        if (
          // 排除特征是完全重复的独立项
          fragment.length > 1 &&
          fragment.every(function(t: any, j: any) {
            return (
              j === 0 ||
              (similarLogic
                ? similarLogic(t, fragment[j - 1])
                : t === fragment[j - 1])
            );
          })
        ) {
          // 如果完全重复的独立项
        } else if (featureLogic && !featureLogic(fragment)) {
          // 如果不符合特征逻辑
        } else {
          // 如果重复片段符合逻辑，会进入当前环节
          // 判断重复片段
          const isRepeat = fragmentCache.some(function(_p: any) {
            const p: any = _p;
            // existing:当前片段与缓存片段，每一段都符合逻辑特征判断
            const existing =
              p.feature === fragment.length &&
              //  只有一个特征时，还须连续的重复；多个特征时，只需逻辑相同
              p.target.some(function(t: any) {
                return (
                  (p.feature === 1 ? index === p.lastIndex + 1 : true) &&
                  t.every(function(f: any, findex: any) {
                    return similarLogic
                      ? similarLogic(f, fragment[findex])
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
    const sorter = filterLogic(fragmentCache);
    //  筛选已被选用的节点组
    const pond: any[] = [];
    return sorter.filter(function(s: any) {
      const _cache: any = [];
      const res: any = s.target.every((target: any) => {
        const isInPond = target.some((t: any) => {
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

export default LayoutCircle;
