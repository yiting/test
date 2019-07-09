// 可变节点模型, 用于匹配单行文本
//
// 可变节点模型的关键是根据准则找出一组符合规则的节点, 这里的处理规则是:
// 1. 元素的高度小于等于40
// 1. 元素在y轴投影相交,并且可以找出一个元素在高度上包含了所有元素(上下浮动10)
// 3. 元素间彼此相间距离小于30
// 4. 元素数量大于等于2个

import Common from '../../common';
import Model from '../../model';
import Utils from '../../utils';

const HSpace = 20; // 水平间距
const VHeight = 50; // 垂直高度要求
const lineHeight = 1.4; //sketch 默认行高

function isConnect(a: any, b: any, dir: number = 0) {
  const aCx = (a.abX + a.abXops) / 2;
  const bCx = (b.abX + b.abXops) / 2;
  const aCy = (a.abY + a.abYops) / 2;
  const bCy = (b.abY + b.abYops) / 2;
  return (
    Math.abs(aCx - bCx) <= (a.abXops - a.abX + b.abXops - b.abX) / 2 + dir &&
    Math.abs(aCy - bCy) <= (a.abYops - a.abY + b.abYops - b.abY) / 2 + dir
  );
}
function calAcross(layer: any[]) {
  // filter
  const maxSizeArr: any = [];
  layer.forEach((nd: any) => {
    if (nd.data.styles && nd.data.styles.texts) {
      const max = Math.max(...nd.data.styles.texts.map((t: any) => t.size));
      nd.data.styles.maxSize = max;
      maxSizeArr.push(max);
    }
  });
  const maxSize: number = Math.max(...maxSizeArr);
  const _maxSize = maxSize > 0 ? maxSize * lineHeight : VHeight;
  layer = layer.filter((nd: any) => {
    const max = nd.data.styles.maxSize;
    return (max ? max : nd.height) <= _maxSize;
  });
  layer.sort((a: any, b: any) => a.abYops + a.abY - b.abYops - b.abY);

  //
  let abY: number | null = null,
    abYops: number | null = null;
  let cur: any[] = [];
  let prev: any;
  const list: any[] = [cur];
  layer.forEach((l: any) => {
    if (abY === null && abYops === null) {
      abY = l.abY;
      abYops = l.abYops;
      cur.push(l);
    } else if (l.abYops < abY || l.abY > abYops) {
      // 不在范围内
      abY = l.abY;
      abYops = l.abYops;
      if (prev && prev.abYops > l.abY && prev.abY < l.abYops) {
        // 如果前节点连接了前后节点，则移出队列
        list.push(cur.pop());
      }

      // 新增一行节点
      cur = [l];
      list.push(cur);
    } else {
      if (l.abY >= abY) {
        abY = l.abY;
      }
      if (l.abYops >= abYops) {
        abY = l.abY;
      }
      prev = l;
      cur.push(l);
    }
  });
  return list;
}
class EMXM1 extends Model.ElementXModel {
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

    let res1: any[] = this.regular1(nodes);
    let res2: any[] = this.regular2(res1);
    // let res3: any[] = this.regular3(res2);
    this._matchDatas = res2;

    // 至少有一组匹配上emx-m1的元素
    if (res2.length >= 1) {
      result = true;
    }
    return result;
  }

  // 判断条件3：元素的高度小于等于40
  regular3(groups: any[]) {
    return groups.filter((nodes: any) => {
      const sizes: number[] = [];
      const lineHeight = 1.4; //sketch 默认行高
      nodes.forEach((nd: any) => {
        const st = nd.data.styles;
        if (st && st.texts) {
          sizes.push(...st.texts.map((s: any) => s.size));
        }
      });
      const _m = Math.max(...sizes);
      const _maxSize = _m > 0 ? _m * lineHeight : VHeight;
      return nodes.every((nd: any) => nd.height <= _maxSize);
    });
  }

  // 判断条件1：元素在y轴投影相交,并且可以找出一个元素在高度上包含了所有元素(上下浮动10)
  // 这里留下面处理，这里迟一点点处理
  regular1(nodes: any[]) {
    // y轴投影出各分组
    const result: any[] = [];
    const rows: any[] = [];
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
    // nodes = nodes.filter((nd: any) => nd.height < 42);
    // 计算出所有分组
    nodes.forEach((nd: any, index: number) => {
      if (index === 0) {
        let temp: any = createTempData(nd);
        rows.push(temp);
      } else {
        let canJoin = false;
        for (let i = 0; i < rows.length; i++) {
          let res = rows[i];
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
          rows.push(temp);
        }
      }
    });

    rows.forEach((rowGroup: any) => {
      // if (rowGroup.arr.some((nd: any) => ~nd.id.indexOf("9A61C529-E2A9-46F8-8943-ED90FC718A2C-c"))) debugger

      const list = calAcross(rowGroup.arr);
      result.push(...list);
    });

    return result;
  }

  // 判断条件3, 4：元素间彼此相间距离小于30, 个数大于等于2个
  regular2(groups: any[]) {
    const that = this;
    let result: any[] = [];

    if (groups.length === 0) {
      return result;
    }

    // 计算每一组里面节点的间隔
    groups.forEach((nodes: any) => {
      // const nodes: any[] = gp.arr;

      if (nodes.length >= 2) {
        // 按abX排列
        Utils.sortListByParam(nodes, 'abX', false);
        // 这里计算一行里面可以出现多少组
        let temp: any[] = [];

        for (let i = 1; i < nodes.length; i++) {
          let preNode: any = nodes[i - 1];
          let curNode: any = nodes[i];
          let preSize = 0;
          let curSize = 0;
          // if (preNode.id == "AA453FF1-84B5-4576-BECD-2B4CFD0E5C32-c") debugger
          if (preNode.type == 'QText' && preNode.data.styles.texts) {
            preSize = preNode.data.styles.texts.slice(-1)[0].size;
          }
          if (curNode.type == 'QText' && curNode.data.styles.texts) {
            curSize = curNode.data.styles.texts[0].size;
          }
          /**
           * 如果前后都是文本，则用半个文本间隙
           * 如果只有一个文本，则用一个文本间隙
           * 如果没有文本，则用一个固定间隙
           */

          const space =
            (preSize && curSize
              ? Math.max(preSize, curSize) / 2
              : Math.max(preSize, curSize)) || HSpace;
          if (
            curNode.abX - preNode.abXops <= space &&
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
            if (temp.length > 1) {
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
