// 此模块用于定义一些在dsl模块包中用到的工具函数
import Utils from '../helper/uitls';

const utils = {
  /**
   * 将驼峰命名转为“-”分割的命名
   */
  nameLower(str: string) {
    return str.replace(/([A-Z])/gm, '-$1').toLowerCase();
  },

  getRangeByNodes(nodes: any[]) {
    if (!nodes) {
      return {};
    }
    const o = {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY,
      abX: Number.POSITIVE_INFINITY,
      abY: Number.POSITIVE_INFINITY,
      width: 0,
      height: 0,
    };
    let right = 0;
    let bottom = 0;
    nodes.forEach((d: any, i: number) => {
      const { height } = d;
      o.x = d.x < o.x ? d.x : o.x;
      o.y = d.y < o.y ? d.y : o.y;
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      right = right < d.abX + d.width ? d.abX + d.width : right;
      bottom = bottom < d.abY + d.height ? d.abY + d.height : bottom;
    });
    o.height = bottom - o.abY;
    o.width = right - o.abX;
    return o;
  },
  gatherByLogic(domArr: any[], logic: Function) {
    const newArr: any = [];
    domArr.forEach((meta, i) => {
      let st: any = newArr.find((n: any, k: number) => n.includes(meta));
      if (!st) {
        st = [meta];
        newArr.push(st);
      }
      domArr.forEach((target, j) => {
        if (target === meta || st.includes(target)) {
          return;
        }
        if (logic(meta, target)) {
          const qr = newArr.find((n: any, qi: number) => n.includes(target));
          if (qr) {
            newArr[newArr.indexOf(st)] = st.concat(qr);
            st = st.concat(qr);
            newArr.splice(newArr.indexOf(qr), 1);
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
    nodes.forEach((d: any, i) => {
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      o.abYops = o.abYops < d.abYops ? d.abYops : o.abYops;
      o.abXops = o.abXops < d.abXops ? d.abXops : o.abXops;
    });
    o.height = o.abYops - o.abY;
    o.width = o.abXops - o.abX;
    return o;
  },
  // 包含关系
  isWrap(outer: any, inner: any, dir: number = 0) {
    return this.isXWrap(outer, inner, dir) && this.isYWrap(outer, inner, dir);
  },
  // 在Y轴上是包含关系
  isYWrap(a: any, b: any, dir: number = 0) {
    return Utils.isYWrap(a.abY, a.abYops, b.abY, b.abYops, dir);
  },
  // 在X轴上是包含关系
  isXWrap(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return Utils.isXWrap(a.abX, a.abXops, b.abX, b.abXops, dir);
  },
  // 相连关系
  isConnect(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return this.isXConnect(a, b, dir) && this.isYConnect(a, b, dir);
  },
  // 水平方向相连
  isXConnect(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return Utils.isXConnect(a.abX, a.abXops, b.abX, b.abXops, dir);
  },
  // 垂直方向相连
  isYConnect(
    a: { abY: number; abYops: number },
    b: { abY: number; abYops: number },
    dir = 0,
  ) {
    return Utils.isYConnect(a.abY, a.abYops, b.abY, b.abYops, dir);
  },
  /**
   * 是否垂直
   * 当doms数量只有一个,返回false
   */
  isVertical(arr: [], errorCoefficient: number = 0) {
    return !this.isHorizontal(arr, errorCoefficient);
  },
  horizontalLogic(a: any, b: any, errorCoefficient = 0) {
    if (
      // 如果水平方向相连
      this.isXConnect(a, b, -1) &&
      // 如果垂直不包含
      !this.isYWrap(a, b)
    ) {
      return false;
    }
    // return (a_abY < b_abY + b_height + errorCoefficient) &&
    // (b_abY < a_abY + a_height + errorCoefficient);
    return this.isYConnect(a, b, errorCoefficient);
  },
  /**
   * 是否水平
   * logic：若垂直方向不相交，则水平方向相交为水平
   * 若垂直方向相交，则水平方向互相包含则水平
   * 当doms数量只有一个,返回true
   */
  isHorizontal(doms: any[], _errorCoefficient: any = 0) {
    const errorCoefficient = parseFloat(_errorCoefficient) || 0;
    const _ = this;
    return doms.every((a, i) => {
      const isFix = doms.every((b, j) => {
        const isFix2 = j <= i || _.horizontalLogic(a, b, errorCoefficient);
        return isFix2;
      });
      return isFix;
    });
  },
};

// export default utils;
export default utils;
