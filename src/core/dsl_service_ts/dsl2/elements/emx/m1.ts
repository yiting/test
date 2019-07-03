// 可变节点模型, 用于匹配单行文本
//
// 可变节点模型的关键是根据准则找出一组符合规则的节点, 这里的处理规则是:
// 1. 元素的高度小于等于40
// 2. 元素在y轴投影相交,并且可以找出一个元素在高度上包含了所有元素(上下浮动10)
// 3. 元素间彼此相间距离小于30
// 4. 元素数量大于等于2个

import Common from '../../common';
import Model from '../../model';
import Utils from '../../utils';

class EMXM1 extends Model.ElementXModel {
  _maxSize: number;
  constructor() {
    // 无限节点
    super('emx-m1', 0, 0, 0, 0, Common.LvA, Common.QText);
  }

  // 改写是否匹配函数
  isMatch(nodes: any[]): boolean {
    let result: boolean = false;

    if (nodes.length === 0) {
      return result;
    }
    this._maxSize = 0;

    let res1: any[] = this.regular1(nodes);
    let res2: any[] = this.regular2(res1);
    let res3: any[] = this.regular3(res2);
    this._matchDatas = res3;

    // 至少有一组匹配上emx-m1的元素
    if (res3.length >= 1) {
      result = true;
    }
    return result;
  }

  // 判断条件1：元素的高度小于等于40
  regular1(nodes: any[]) {
    let result: any[] = [];
    let sizes = nodes.map(
      (nd: any) =>
        (nd.data.styles &&
          nd.data.styles.texts &&
          nd.data.styles.texts[0].size) ||
        0,
    );
    this._maxSize = Math.max(...sizes);
    const lineHeight = 1.33; //sketch 默认行高
    this._maxSize = this._maxSize > 0 ? this._maxSize : 50;
    const _maxSize = this._maxSize * lineHeight;
    nodes.forEach((nd: any) => {
      if (nd.height <= _maxSize) {
        result.push(nd);
      }
    });
    return result;
  }

  // 判断条件2：元素在y轴投影相交,并且可以找出一个元素在高度上包含了所有元素(上下浮动10)
  // 这里留下面处理，这里迟一点点处理
  regular2(nodes: any[]) {
    // y轴投影出各分组
    let result: any[] = [];

    if (nodes.length === 0) {
      return result;
    }

    let createTempData = function(node: any): any {
      let temp: any = {};
      temp.minH = node.abY;
      temp.maxH = node.abYops; // 记录每个由节点组成的数组的高度上下限
      temp.arr = [];
      temp.arr.push(node);

      return temp;
    };

    // 计算出所有分组
    nodes.forEach((nd: any, index: number) => {
      if (index === 0) {
        let temp: any = createTempData(nd);
        result.push(temp);
      } else {
        let canJoin = false;
        for (let i = 0; i < result.length; i++) {
          let res = result[i];
          // 判断是否与res相交, 相交则加入对应的数组
          if (nd.abYops >= res.minH && nd.abY <= res.maxH) {
            res.arr.push(nd);
            canJoin = true;
            return;
          }
        }

        if (!canJoin) {
          // 不能加入则创建一个新组来处理
          let temp: any = createTempData(nd);
          result.push(temp);
        }
      }
    });

    return result;
  }

  // 判断条件3, 4：元素间彼此相间距离小于30, 个数大于等于2个
  regular3(groups: any[]) {
    const that = this;
    let result: any[] = [];

    if (groups.length === 0) {
      return result;
    }

    // 计算每一组里面节点的间隔
    groups.forEach((gp: any) => {
      let nodes: any[] = gp.arr;

      if (nodes.length >= 2) {
        // 按abX排列
        Utils.sortListByParam(nodes, 'abX', false);
        // 这里计算一行里面可以出现多少组
        let temp: any[] = [];

        for (let i = 1; i < nodes.length; i++) {
          let preNode: any = nodes[i - 1];
          let curNode: any = nodes[i];

          if (
            curNode.abX - preNode.abXops <= that._maxSize &&
            curNode.abX - preNode.abXops >= -4
          ) {
            // 连续的元素
            if (temp.length === 0) {
              temp.push(preNode);
            }
            temp.push(curNode);

            // 如果i已经是最后的了,则放进result
            if (i === nodes.length - 1) {
              // 如果temp的数量大于2, 则认为匹配成功
              if (temp.length >= 2) {
                result.push(temp);
              }
            }
          } else {
            // 分割开了, 判断此时temp是否数量大于2个，则认为匹配成功
            if (temp.length >= 2) {
              result.push(temp);
            }
            // 因为断开了,清空数组
            temp = [];
          }
        }
      }
    });

    return result;
  }
}

export default EMXM1;
