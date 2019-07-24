// 此模块用于定义一些在render模块包中用到的工具函数
import Constraints from '../helper/constraints';
import Utils from '../uitls';

export default {
  /**
   * 将驼峰命名转为“-”分割的命名
   */
  nameLower(str: string) {
    return str.replace(/([A-Z])/gm, '-$1').toLowerCase();
  },
  // 包含关系
  isWrap(outer: any, inner: any, dir = 0) {
    return this.isXWrap(outer, inner, dir) && this.isYWrap(outer, inner, dir);
  },
  // 在Y轴上是包含关系
  isYWrap(a: any, b: any, dir = 0) {
    return Utils.isYWrap(a.abY, a.abYops, b.abY, b.abYops, dir);
  },
  // 在X轴上是包含关系
  isXWrap(a: any, b: any, dir = 0) {
    return Utils.isXWrap(a.abX, a.abXops, b.abX, b.abXops, dir);
  },
  // 相连关系
  isConnect(a: any, b: any, dir = 0) {
    return this.isXConnect(a, b, dir) && this.isYConnect(a, b, dir);
  },
  // 水平方向相连
  isXConnect(a: any, b: any, dir = 0) {
    return Utils.isXConnect(a.abX, a.abXops, b.abX, b.abXops, dir);
  },
  // 垂直方向相连
  isYConnect(a: any, b: any, dir = 0) {
    return Utils.isYConnect(a.abY, a.abYops, b.abY, b.abYops, dir);
  },
  /**
   * 是否垂直
   * 当doms数量只有一个,返回false
   */
  isVertical(arr: any, errorCoefficient = 0) {
    return !this.isHorizontal(arr, errorCoefficient);
  },
  horizontalLogic(a: any, b: any, errorCoefficient: any) {
    if (
      // 如果水平方向相连
      this.isXConnect(a, b, -1) &&
      // 如果垂直不包含
      !this.isYWrap(a, b)
    ) {
      return false;
    }
    return this.isYConnect(a, b, errorCoefficient);
  },
  /**
   * 是否水平
   * logic：若垂直方向不相交，则水平方向相交为水平
   * 若垂直方向相交，则水平方向互相包含则水平
   * 当doms数量只有一个,返回true
   */
  isHorizontal(doms: any[], errorCoefficient = 0) {
    const _ = this;
    return doms.every((a: any, i: number) =>
      doms.every(
        (b: any, j: number) =>
          j <= i || _.horizontalLogic(a, b, errorCoefficient),
      ),
    );
  },
  gatherByLogic(domArr: any[], logic: (meta: any, target: any) => {}) {
    const newArr: any[] = [];
    domArr.forEach((meta: any, i: any) => {
      // 判断矩阵中是否存在该节点
      let st = newArr.find((n, k) => n.includes(meta));
      // 如果不存在，把节点放入矩阵
      if (!st) {
        st = [meta];
        newArr.push(st);
      }
      // 对比循环
      domArr.forEach((target: any, j: any) => {
        // 如果目标节点与源节点相同，或目标节点已经在矩阵中，则不对比
        if (target === meta || st.includes(target)) {
          return;
        }
        // 如果符合相似逻辑
        if (logic(meta, target)) {
          // 在矩阵中找到包含目标元素的队列
          const qr = newArr.find((n, qi) => n.includes(target));
          // 如果存在该队列
          if (qr) {
            // 当前队列与目标队列串联
            const stIndex = newArr.indexOf(st);
            const qrIndex = newArr.indexOf(qr);
            st = st.concat(qr);
            newArr[stIndex] = st;
            newArr.splice(qrIndex, 1);
          } else {
            st.push(target);
          }
        }
      });
    });
    return newArr;
  },
  calRange(nodes: any[]) {
    if (!nodes) {
      return {};
    }
    const o = {
      abX: Number.POSITIVE_INFINITY,
      abY: Number.POSITIVE_INFINITY,
      abYops: Number.NEGATIVE_INFINITY,
      abXops: Number.NEGATIVE_INFINITY,
      width: 0,
      height: 0,
    };
    nodes.forEach((d: any, i: any) => {
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      o.abYops = o.abYops < d.abYops ? d.abYops : o.abYops;
      o.abXops = o.abXops < d.abXops ? d.abXops : o.abXops;
    });
    o.height = o.abYops - o.abY;
    o.width = o.abXops - o.abX;
    return o;
  },
  calculateBaseLine(vdom: any) {
    let X = 0;
    let Y = 0;
    let Xops = 0;
    let Yops = 0;
    let Xctr = 0;
    let Yctr = 0;
    const pXctr = (vdom.abX + vdom.abXops) / 2;
    const pYctr = (vdom.abY + vdom.abYops) / 2;
    let nodeCount = 0;
    const errorCoefficient = 2; // 误差系数
    vdom.children.forEach((node: any) => {
      if (
        node.constraints.LayoutSelfPosition ===
        Constraints.LayoutSelfPosition.Absolute
      ) {
        // 剔除绝对定位
        return;
      }
      nodeCount += 1;
      X += Math.abs(node.abX - vdom.abX);
      Y += Math.abs(node.abY - vdom.abY);
      Xops += Math.abs(vdom.abXops - node.abXops);
      Yops += Math.abs(vdom.abYops - node.abYops);
      Xctr += Math.abs(pXctr - (node.abX + node.abXops) / 2);
      Yctr += Math.abs(pYctr - (node.abY + node.abYops) / 2);
    });
    const hStart = Math.abs(X / nodeCount) < errorCoefficient;
    const hCenter = Math.abs(Xctr / nodeCount) < errorCoefficient;
    const hEnd = Xops / nodeCount === 0;
    const vStart = Math.abs(Y / nodeCount) < errorCoefficient;
    const vCenter = Math.abs(Yctr / nodeCount) < errorCoefficient;
    const vEnd = Yops / nodeCount === 0;

    const horizontalCenter = hCenter && !hStart && !hEnd;
    const horizontalEnd = hEnd && !hStart;
    const horizontalStart = !horizontalCenter && !horizontalEnd;
    // const verticalCenter = vCenter && !vStart && !vEnd;
    const verticalCenter = vCenter;
    // const verticalEnd = vEnd && !vStart;
    const verticalEnd = vEnd && !vCenter && !vStart;
    const verticalStart = !verticalCenter && !verticalEnd;

    return {
      horizontalStart,
      horizontalCenter,
      horizontalEnd,
      verticalStart,
      verticalCenter,
      verticalEnd,
    };
  },
};
