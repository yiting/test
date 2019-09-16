import Common from '../dsl2/common';
import Utils from './utils';
import Model from '../dsl2/model';
import Constraints from '../helper/constraints';
import Store from '../helper/store';
import { debug } from 'util';

function calColumn(layer: any[]) {
  layer.sort((a: any, b: any) => a.abY + a.abYops - b.abYops - b.abY);
  const rowNodes: any[] = [];
  const outer: any[] = [];
  layer.forEach((l: any, i: number) => {
    // 如果存在在两个间隙间的元素，则绝对定位，拆分行
    const cache: any = [];
    let prev: any;
    let next: any;
    const isOuter = cache.some((c: any) => {
      if (!prev && c.abYops > l.abY) {
        prev = c;
        return false;
      }
      if (prev && c.abY < l.abYops) {
        next = c;
        return true;
      }
      return false;
    });
    if (isOuter) {
      outer.push(l);
    } else {
      rowNodes.push(l);
    }
  });
  const absNodes: any[] = [];
  const colNodes: any[] = [];
  outer.forEach((a: any) => {
    const isAbsolute = rowNodes.some((b: any) => {
      return Utils.isConnect(a, b);
    });
    if (isAbsolute) {
      absNodes.push(a);
    } else {
      colNodes.push(a);
    }
  });

  return {
    absNodes,
    colNodes,
    rowNodes,
  };
}

const DSLOptions: any = {};
/**
 * DSL树的构建类,用于生成和输出标准数据
 */
class Tree {
  _treeData: any;

  _modelData: {};

  _layoutData: {};

  static LayerId: number;

  constructor(bodyModel: any) {
    Object.assign(DSLOptions, Store.getAll());
    // 创建根节点, 节点树总数据, 即为RenderData
    this._treeData = Tree.createNodeData(null);
    this._treeData.set('id', bodyModel.id);
    this._treeData.set('parent', null);
    this._treeData.set('type', Common.QBody);
    this._treeData.set('abX', 0);
    this._treeData.set(
      'abXops',
      bodyModel.width > DSLOptions.designWidth
        ? DSLOptions.designWidth
        : bodyModel.width,
    );
    this._treeData.set('abY', 0);
    this._treeData.set('abYops', bodyModel.height);
    this._treeData.set('isCalculate', true);
    this._treeData.set('styles', bodyModel.styles);

    // 组件模型信息储存
    this._modelData = {};
    // 布局模型信息储存
    this._layoutData = {};
  }

  _row(parent: any) {
    const { children } = parent;
    // 如果只有一个子节点，则不生成新组
    if (children.length <= 1) {
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
      const range = Utils.calRange(
        l.filter(
          (n: any) =>
            n.constraints &&
            n.constraints.LayoutSelfPosition !==
              Constraints.LayoutSelfPosition.Absolute,
        ),
      );
      Object.assign(l, range);
    });

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
        (firstNode.constraints['LayoutSelfPosition'] ===
          Constraints.LayoutSelfPosition.Absolute ||
          (firstNode.type !== Common.QText &&
            firstNode.abX === parent.abX &&
            firstNode.abXops === parent.abXops) ||
          firstNode.modelName === 'wg1-m1' ||
          firstNode.modelName === 'wg1-m2')
      ) {
        newChildren.push(firstNode);
      } else {
        // // 判断是否横跨两行结构
        // const { absNodes, rowNodes, colNodes } = calColumn(arr);
        // absNodes.forEach((nd: any) => {
        //   nd.constraints.LayoutSelfPosition = Constraints.LayoutSelfPosition.Absolute;
        // });

        // 多个节点情况
        // 自左而右排序
        arr.sort((a: any, b: any) => a.abX - b.abX);

        const node = Tree.createNodeData(null);
        node.set('parent', parent);
        // node.set("abX", arr.abX);
        node.set('abX', parent.abX);
        node.set('abY', arr.abY);
        // node.set("abXops", arr.abXops);
        node.set('abXops', parent.abXops);
        node.set('abYops', arr.abYops);

        arr.forEach((child: any) => {
          child.set('parent', node);
          node.set('children', node.children.concat(child));
          // 新增节点，重置层级关系
          node.resetZIndex();
        });
        newChildren.push(node);
      }
    });

    // 替换原来的结构
    parent.set('children', newChildren);
  }

  _column(parent: any) {
    const { children } = parent;
    // 如果只有一个子节点，则不生成新组
    if (children.length <= 1) {
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
      const range = Utils.calRange(
        l.filter(
          (n: any) =>
            n.constraints &&
            n.constraints.LayoutSelfPosition !==
              Constraints.LayoutSelfPosition.Absolute,
        ),
      );
      Object.assign(l, range);
    });
    // 自左向右排序
    layers.sort((a: any, b: any) => a.abX - b.abX);
    const newChildren: any = [];
    const everyArrHasOne = layers.every((arr: any) => arr.length === 1);
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
      // if (
      //   (arr.length === 1 && firstNode.type !== Common.QText) ||
      //   firstNode.constraints['LayoutSelfPosition'] ===
      //     Constraints.LayoutSelfPosition.Absolute
      // ) {
      if (
        arr.length === 1 &&
        // (firstNode.type !== Common.QText &&
        //   firstNode.type !== Common.QImage) ||
        (firstNode.type === Common.QWidget ||
          firstNode.type === Common.QLayer ||
          (firstNode.type === Common.QImage && everyArrHasOne) ||
          firstNode.constraints['LayoutSelfPosition'] ===
            Constraints.LayoutSelfPosition.Absolute)
      ) {
        // 当纵向节点只有一个时
        newChildren.push(firstNode);
      } else {
        // 多个节点情况
        // 自上而下排序
        arr.sort((a: any, b: any) => a.abY - b.abY);

        const node = Tree.createNodeData(null);
        node.set('parent', parent);
        node.set('abX', arr.abX);
        node.set('abY', arr.abY);
        node.set('abXops', arr.abXops);
        node.set('abYops', arr.abYops);

        arr.forEach((child: any) => {
          child.set('parent', node);
          node.set('children', node.children.concat(child));
          node.resetZIndex();
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
    // 按面积排序
    arr
      .sort((a: any, b: any) => a.zIndex - b.zIndex)
      .sort((a: any, b: any) => b.width * b.height - a.width * a.height);
    // let segmentings = []
    arr.forEach((child: any, i: any) => {
      if (child && child.type !== Common.QBody) {
        const done = compareArr.some(parent => {
          // if (child.id == '99E7D055-45F1-4F84-B471-DB8095799FEA-c' && parent.id == '9E422C3C-60C1-417E-B3A4-53F45D52095D') debugger
          const _utils = Utils;
          // 如果自节点在父节点下
          if (
            // 层级关系
            child.zIndex < parent.zIndex &&
            // 包含关系
            _utils.isWrap(parent, child)
          ) {
            Tree._add(child, parent.parent || parent, true);
            arr[i] = null;
            return true;
          }
          /**
           * 在父节点上,
           * 描述：parent面积必 大于等于 child面积，通过判断是否存在包含关系得出，child是否为parent子节点
           */
          if (
            // 父节点必须不是文本类型
            parent.type !== Common.QText &&
            // 子节点不能分割线
            child.modelName !== 'wg1-m1' &&
            // 层级关系
            child.zIndex >= parent.zIndex &&
            // 包含关系
            (_utils.isWrap(parent, child) ||
              // 水平相连、垂直包含关系
              (_utils.isXConnect(parent, child, -1) &&
                _utils.isYWrap(parent, child)) ||
              // 水平包含、垂直相连
              (parent.abY > child.abY &&
                _utils.isYConnect(parent, child, -1) &&
                _utils.isXWrap(parent, child)) ||
              // 相连不包含关系（占只4个角），两个面积差值较大
              (_utils.isConnect(parent, child, -1) &&
                !_utils.isXWrap(parent, child) &&
                !_utils.isYWrap(parent, child) &&
                parent.width / child.width > 2 &&
                parent.height / child.height > 2))
          ) {
            const node = Tree._add(child, parent, false);
            compareArr.unshift(node);
            arr[i] = null;
            return true;
          }
          return false;
        });
        if (!done) {
          const node = Tree._add(child, body, false);
          compareArr.unshift(node);
          arr[i] = null;
        }
      }
    });
  }
  static _isAbsoluteRelation(node: any, parent: any) {
    /**
     * 如果子节点在父节点的角点上，切高宽为一定比例，则认为是父节点外的绝对定位
     * */
    // const leftTop = node.abX <= parent.abX && node.abY <= parent.abY;
    // const rightTop = node.abXops >= parent.abXops && node.abY <= parent.abY;
    // const leftBottom = node.abX <= parent.abX && node.abYops >= parent.abYops;
    // const rightBottom =
    //   node.abXops >= parent.abXops && node.abYops >= parent.abYops;
    const left = node.abX <= parent.abX && node.abX > 0;
    const right =
      node.abXops >= parent.abXops && node.abXops < DSLOptions.designWidth;
    const bottom = node.abYops >= parent.abYops;
    const top = node.abY <= parent.abY;
    const rate = 2;
    const rateX =
      (parent.abXops - parent.abX) / (node.abXops - node.abX) > rate;
    const rateY =
      node.abYops - node.abY <= 28 * 2 &&
      (parent.abYops - parent.abY) / (node.abYops - node.abY) > rate;
    return (left || right || top || bottom) && rateX && rateY;
  }
  /**
   * 往父节点添加子节点
   * @param {MatchData} child 子节点
   * @param {MatchData} parent 父节点
   */
  static _add(_child: any, _parent: any, _isAbsolute: Boolean) {
    // node为RenderData
    let parent: any = _parent;
    let child: any = _child;
    const node = Tree.createNodeData(child);
    if (!_isAbsolute && Tree._isAbsoluteRelation(node, parent)) {
      parent = parent.parent || parent;
      parent.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
      node.constraints.LayoutSelfPosition =
        Constraints.LayoutSelfPosition.Absolute;
    }

    if (_isAbsolute) {
      node.constraints.LayoutSelfPosition =
        Constraints.LayoutSelfPosition.Absolute;
    }

    node.set('parent', parent);
    parent.set('children', parent.children.concat(node));
    /**
     * 如果父节点为QImage时，添加子节点后，父节点模型类型改为layer，
     * 让父节点取代使用QImage模板
     * */
    if (parent.type === Common.QImage) {
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
  createLayer(_treeData: any) {
    this._row(_treeData);
    this._column(_treeData);
    // 从里面到外进行组合分析
    const { children } = _treeData;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.children !== 0) {
        // 继续进入下一层
        this.createLayer(child);
      }
    }
  }

  //
  setModelData(mdata: any) {
    if (!mdata || !mdata.id) {
      return;
    }
    const that: any = this;
    that._modelData[mdata.id] = mdata;
  }

  // 获取RenderData数据
  getRenderData() {
    return this._treeData;
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
    newRenderData.set('parent', parent);
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
        renderDataI.set('parent', newRenderData);
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

export default Tree;
