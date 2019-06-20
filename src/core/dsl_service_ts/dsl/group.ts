import Common from './common';
import Utils from './utils';
import Model from './model';
import Constraints from './constraints';

import QLog from '../log/qlog';
import uitls from '../uitls';

const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 * 将组件进行排版布局
 * @param {Array} widgetModels 进行布局的组件模型
 * @param {Array} elementModels 进行布局的元素模型
 * @returns {Object} 返回结构树
 */
const join = function(widgetModels: any, elementModels: any) {
  if (!widgetModels && !elementModels) {
    return null;
  }
  const dslTree: any = new Tree(); // dsl树
  const arr = elementModels.concat(widgetModels);
  // 按面积排序
  arr.sort((a: any, b: any) => b.width * b.height - a.width * a.height);
  try {
    dslTree._setModelData(arr);
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 储存记录添加的MatchData
      error:${e}`);
  }
  try {
    dslTree._addNode(arr);
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 元素重组
      error:${e}`);
  }
  try {
    // 创建layers
    dslTree._rowNode();
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 创建layers
      error:${e}`);
  }
  try {
    dslTree._columnNode();
  } catch (e) {
    Loger.error(`dsl/group.ts join()
      desc: 对节点进行成列排版
      error:${e}`);
  }
  return dslTree;
};
function con(a: any, b: any, aid: string, bid: string) {
  return (a.id == aid || a.id == bid) && (b.id == aid || b.id == bid);
}
/**
 * DSL树的构建类,用于生成和输出标准数据
 */
class Tree {
  _treeData: any;

  _modelData: {};

  _layoutData: {};

  _layoutType: any;

  static LayerId: number;

  constructor() {
    // 创建根节点, 节点树总数据, 即为RenderData
    this._treeData = Tree.createNodeData(null);
    this._treeData.set('parentId', null);
    this._treeData.set('type', Common.QBody);
    this._treeData.set('abX', 0);
    this._treeData.set('abXops', Common.DesignWidth);
    this._treeData.set('isCalculate', true);

    // 组件模型信息储存
    this._modelData = {};
    // 布局模型信息储存
    this._layoutData = {};
    // 布局形式
    this._layoutType = null;
  }

  _row(parent: any) {
    const { children } = parent;

    // 从里面到外进行组合分析
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children !== 0) {
        // 继续进入下一层
        this._row(child);
      }
    }

    // 如果只有一个子节点，则不生成新组
    if (children.length === 1) {
      // 当只包含一个元素时就不用创建QLayer
      return;
    }

    // 分解行
    const layers = Utils.gatherByLogic(children, (a: any, b: any) => {
      // 如果a节点层级高于b，且a节点位置高于b，且水平相连，则为一组（a为绝对定位，如红点）
      /* if (a._abY < b._abY && a._zIndex > b._zIndex) {
        // 使用-1是因为避免相连元素为一组
        return Utils.isYConnect(a, b, -1);
      }
      return Utils.isYWrap(a, b); */

      if (Utils.isYConnect(a, b, -1)) {
        if (
          // 如果a节点层级高于b，且a节点位置高于b，且水平相连，则为一组（a为绝对定位，如红点）
          (Utils.isXConnect(a, b, -1) &&
            (a._abY < b._abY && a._zIndex < b._zIndex)) ||
          (a._abY > b._abY && a._zIndex > b._zIndex)
        ) {
          return false;
        }
        return true;
      }
      return false;
    });
    // 如果只有一组，则不生产新组
    if (layers.length === 1) {
      return;
    }
    // 计算边界
    layers.forEach((l: any) => {
      const range = Utils.calRange(l);
      Object.assign(l, range);
    });
    // 自上向下排序
    layers.sort((a: any, b: any) => a.abY - b.abY);

    const newChildren: any = [];
    layers.forEach((arr: any) => {
      const firstNode = arr[0];
      /**
       * 删除：如果是单个文本，则须在文本外包布局节点
       */
      // if (arr.length === 1 && arr[0].type !== Common.QText) {
      /**
       * 删除：当横向节点只有一个时
       */
      // if (arr.length === 1) {
      /**
       * 当横向节点只有一个，
       * 且该节点不是绝对定位元素，
       * 且该节点不是不与父节点等宽
       */
      if (
        arr.length === 1 &&
        (firstNode.constraints['LayoutSelfPosition'] !==
          Constraints.LayoutSelfPosition.Absolute ||
          (firstNode.abX === parent.abX &&
            firstNode.abXops === parent.abXops) ||
          firstNode.modelName === 'wg1-m1')
      ) {
        newChildren.push(firstNode);
      } else {
        // 多个节点情况
        // 自左而右排序
        arr.sort((a: any, b: any) => a.abX - b.abX);

        const node = Tree.createNodeData(null);
        node.set('parentId', parent.id);
        // node.set("abX", arr.abX);
        node.set('abX', parent.abX);
        node.set('abY', arr.abY);
        // node.set("abXops", arr.abXops);
        node.set('abXops', parent.abXops);
        node.set('abYops', arr.abYops);

        arr.forEach((child: any) => {
          child.set('parentId', node.id);
          node.set('children', node.children.concat(child));
          // 新增节点，重置层级关系
          // node.resetZIndex();
        });
        newChildren.push(node);
      }
    });

    // 替换原来的结构
    parent.set('children', newChildren);
  }

  _column(parent: any) {
    const { children } = parent;

    // 从里面到外进行组合分析
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children !== 0) {
        // 继续进入下一层
        this._column(child);
      }
    }
    // 如果只有一个子节点，则不生成新组
    if (children.length === 1) {
      // 当只包含一个元素时就不用创建QLayer
      return;
    }

    // 分解列
    const layers = Utils.gatherByLogic(children, (a: any, b: any) =>
      Utils.isXConnect(a, b),
    );
    // 如果只有一列，则不生成新组
    if (layers.length === 1) {
      return;
    }
    // 计算边界
    layers.forEach((l: any) => {
      const range = Utils.calRange(l);
      Object.assign(l, range);
    });
    // 自左向右排序
    layers.sort((a: any, b: any) => a.abX - b.abX);
    const newChildren: any = [];
    layers.forEach((arr: any) => {
      const firstNode = arr[0];
      /**
       *
       */
      // if (arr.length === 1 && arr[0].type !== Common.QText) {
      /**
       * 删除：当横向节点只有一个时
       */
      // if (arr.length === 1) {
      /**
       * 当列拆分只有一个节点，
       * 且该节点不是文本：文本外须包布局节点
       * 且该节点是绝对定位的
       */
      if (
        arr.length === 1 &&
        (firstNode.type !== Common.QText ||
          firstNode.constraints['LayoutSelfPosition'] ===
            Constraints.LayoutSelfPosition.Absolute ||
          firstNode.modelName === 'wg1-m1')
      ) {
        // 当纵向节点只有一个时
        newChildren.push(firstNode);
      } else {
        // 多个节点情况
        // 自上而下排序
        arr.sort((a: any, b: any) => a.abY - b.abY);

        const node = Tree.createNodeData(null);
        node.set('parentId', parent.id);
        node.set('abX', arr.abX);
        node.set('abY', arr.abY);
        node.set('abXops', arr.abXops);
        node.set('abYops', arr.abYops);

        arr.forEach((child: any) => {
          child.set('parentId', node.id);
          node.set('children', node.children.concat(child));
        });
        newChildren.push(node);
      }
    });

    // 替换原来的结构
    parent.set('children', newChildren);
  }

  /**
   * 添加元素节点
   * @param {MatchData} mdata
   */
  _addNode(_arr: any) {
    const arr: any = _arr;
    const body = this._treeData;
    const compareArr = [body];
    const leftArr = [];
    // let segmentings = []
    arr.forEach((child: any, i: any) => {
      if (child && child.type !== Common.QBody) {
        const done = compareArr.some(parent => {
          /**
           * 在父节点上,
           * 描述：parent面积必 大于等于 child面积，通过判断是否存在包含关系得出，child是否为parent子节点
           */

          if (
            parent.type !== Common.QText &&
            child.modelName !== 'wg1-m1' &&
            // parent.type !== Common.QWidget &&
            // 层级关系
            // child.zIndex > parent.zIndex &&
            // 包含关系
            (Utils.isWrap(parent, child) ||
            (Utils.isXConnect(parent, child, -1) &&
              Utils.isYWrap(parent, child)) ||
            (parent.abY > child.abY &&
              Utils.isYConnect(parent, child, -1) &&
              Utils.isXWrap(parent, child)) || // 相连关系，两个大小差值较大
              (Utils.isConnect(parent, child, -1) &&
                !Utils.isXWrap(parent, child) &&
                !Utils.isYWrap(parent, child) &&
                parent.width / child.width > 2 &&
                parent.height / child.height > 2))
          ) {
            const node = Tree._add(child, parent);
            compareArr.unshift(node);
            arr[i] = null;
            return true;
          }
          return false;
        });
        if (!done) {
          const node = Tree._add(child, body);
          compareArr.unshift(node);
          leftArr.unshift(node);
          arr[i] = null;
        }
      }
    });
  }

  /**
   * 往父节点添加子节点
   * @param {MatchData} child 子节点
   * @param {MatchData} parent 父节点
   */
  static _add(child: any, parent: any) {
    // node为RenderData
    const node = Tree.createNodeData(child);
    node.set('parentId', parent.id);
    parent.set('children', parent.children.concat(node));
    /**
     * 如果父节点为QShape或QImage时，添加子节点后，父节点模型类型改为layer，
     * 让父节点取代使用QShape或QImage模板
     * */
    if (parent.type === Common.QShape || parent.type === Common.QImage) {
      parent.set('modelName', 'layer');
    }
    // 如果父节点为widget，则当前节点绝对定位
    if (parent.type === Common.QWidget) {
      node.constraints.LayoutSelfPosition =
        Constraints.LayoutSelfPosition.Absolute;
    }
    return node;
  }

  /**
   * 储存记录添加的MatchData
   */
  _setModelData(arr: any) {
    arr.forEach((node: any) => {
      this.setModelData(node);
    });
  }

  /**
   * 对节点进行成组排版
   */
  _rowNode() {
    this._row(this._treeData);
  }

  /**
   * 对节点进行成列排版
   */
  _columnNode() {
    this._column(this._treeData);
  }

  //
  setModelData(mdata: any) {
    if (!mdata || !mdata.id) {
      return;
    }
    const that: any = this;
    that._modelData[mdata.id] = mdata;
  }

  //
  setLayoutType(layoutType: any) {
    this._layoutType = layoutType;
  }

  //
  getModelData(id: any) {
    const that: any = this;
    return that._modelData[id];
  }

  // 获取RenderData数据
  getRenderData() {
    return this._treeData;
  }

  //
  getLayoutType() {
    return this._layoutType;
  }

  /**
   * 根据传进的nodes,创建返回的新node
   * @param {RenderData} parent
   * @param {Array} nodesArr
   * @param {Int} similarId
   * @return {RenderData}
   */
  static createCycleData(parent: any, nodesArr: any): any {
    // 组成新节点,并且构建MatchData里的getMatchNode数据
    let newRenderData = null;
    if (!nodesArr || nodesArr.length === 0) {
      return newRenderData;
    }

    newRenderData = new Model.RenderData();
    newRenderData.set('id', `layer${Tree.LayerId}`);
    Tree.LayerId += 1;
    newRenderData.set('parentId', parent.id);
    newRenderData.nodes = {};
    // 传进来的数据暂时只有两级结构, 所以直接coding两层循环
    for (let i = 0; i < nodesArr.length; i++) {
      const nodes = nodesArr[i];

      if (nodes.length === 0) {
        // todo something
      } else if (nodes.length === 1) {
        // 第二层只有一个数据直接返回
        const renderDataI = nodes[0];
        renderDataI.set('modelRef', `${i}`);
        // 递归读取nodes的节点
        // 这里先改用key-value的形式储存在nodes,规避放.childrend的问题
        newRenderData.nodes[`${i}`] = renderDataI;
      } else {
        const renderDataI = new Model.RenderData();
        renderDataI.set('parentId', newRenderData.id);
        renderDataI.set('modelRef', `${i}`);
        renderDataI.children.push(...nodes);
        renderDataI.resize(false); // 新节点重新计算最小范围
        newRenderData.nodes[`${i}`] = renderDataI;
      }
    }

    // 把parent的属性重新设置
    newRenderData.resize(true);
    newRenderData.set('modelName', 'cycle-01');
    newRenderData.set('type', Common.QLayer);

    return newRenderData;
  }

  /**
   * 递归读取nodes里面的Render数据
   * @param {RenderData} parentData 拼装的parent
   * @param {Array} nodes 要解析的节点
   */
  static _handleCycleData(parentData: any, nodes: any) {
    const { children } = nodes;
    if (children.length === 0) {
      return;
    }

    for (let i = 0; i < children.length; i++) {
      const rdata = children[i];
      parentData.children.push(rdata);

      // 递归解析
      Tree._handleCycleData(rdata, children[i]);
    }
  }

  /**
   * 创建TreeNode
   * @param {MatchData} mdata
   * @returns {RenderData}
   */
  static createNodeData(mdata: any) {
    if (mdata && mdata.getRenderData) {
      const renderData = mdata.getRenderData();
      return renderData;
    }

    // 创建一个layer
    const renderData = new Model.RenderData();
    renderData.set('id', `layer${Tree.LayerId}`);
    Tree.LayerId += 1;
    renderData.set('type', Common.QLayer);
    renderData.set('modelName', 'layer');
    renderData.set('modelId', renderData.id);
    return renderData;
  }
}

// 创建layer时的自增id
Tree.LayerId = 0;

export default {
  join,
  Tree,
};
