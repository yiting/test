// 此模块用于定义一些在dsl模块包中用到的工具函数
import Constraints from './constraints';

const utils = {
  /**
   * 将驼峰命名转为“-”分割的命名
   */
  nameLower(str: string) {
    return str.replace(/([A-Z])/gm, '-$1').toLowerCase();
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
  calRange(nodes: any[]): any {
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
      zIndex: Number.POSITIVE_INFINITY,
    };
    nodes.forEach((d: any, i) => {
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      o.abYops = o.abYops < d.abYops ? d.abYops : o.abYops;
      o.abXops = o.abXops < d.abXops ? d.abXops : o.abXops;
      o.zIndex = o.zIndex > d.zIndex ? d.zIndex : o.zIndex;
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
    return (
      Math.abs((a.abY + a.abYops) / 2 - (b.abY + b.abYops) / 2) <=
      Math.abs(a.abYops - a.abY - b.abYops + b.abY) / 2 + dir
    );
  },
  // 在X轴上是包含关系
  isXWrap(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return (
      Math.abs((a.abX + a.abXops) / 2 - (b.abX + b.abXops) / 2) <=
      Math.abs(a.abXops - a.abX - b.abXops + b.abX) / 2 + dir
    );
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
    const aCx = (a.abX + a.abXops) / 2;
    const bCx = (b.abX + b.abXops) / 2;
    return (
      Math.abs(aCx - bCx) <= (a.abXops - a.abX + b.abXops - b.abX) / 2 + dir
    );
  },
  // 垂直方向相连
  isYConnect(
    a: { abY: number; abYops: number },
    b: { abY: number; abYops: number },
    dir = 0,
  ) {
    const aCy = (a.abY + a.abYops) / 2;
    const bCy = (b.abY + b.abYops) / 2;
    return (
      Math.abs(aCy - bCy) <= (a.abYops - a.abY + b.abYops - b.abY) / 2 + dir
    );
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
  filterAbsNode(nodes: any) {
    return nodes.filter((n: any) => {
      return !this.isAbsolute(n);
    });
  },
  isAbsolute(node: any) {
    return (
      node.constraints.LayoutPosition === Constraints.LayoutPosition.Absolute
    );
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
    // if (doms.length < 2) {
    //   return false;
    // }
    return doms
      .filter((n: any) => {
        return !this.isAbsolute(n);
      })
      .every((a, i) => {
        const isFix = doms.every((b, j) => {
          const isFix2 = j <= i || _.horizontalLogic(a, b, errorCoefficient);
          return isFix2;
        });
        return isFix;
      });
  },
  RGB2HEX(color: { r: number; g: number; b: number; a: number }) {
    const red = ('0' + color.r.toString(16)).slice(-2);
    const green = ('0' + color.g.toString(16)).slice(-2);
    const blue = ('0' + color.b.toString(16)).slice(-2);
    const alpha = Number(color.a * 255).toString(16);
    return `0x${alpha}${red}${green}${blue}`;
  },
};

// export default utils;
export default utils;
