export default {
  // 包含关系
  isWrap(
    a_abX: number,
    a_abY: number,
    a_abXops: number,
    a_abYops: number,
    b_abX: number,
    b_abY: number,
    b_abXops: number,
    b_abYops: number,
    dir: number = 0,
  ) {
    return (
      this.isXWrap(a_abX, a_abXops, b_abX, b_abXops, dir) &&
      this.isYWrap(a_abY, a_abYops, b_abY, b_abYops, dir)
    );
  },
  // 在Y轴上是包含关系
  isYWrap(
    a_abY: number,
    a_abYops: number,
    b_abY: number,
    b_abYops: number,
    dir: number = 0,
  ) {
    return (
      Math.abs((a_abY + a_abYops) / 2 - (b_abY + b_abYops) / 2) <=
      Math.abs(a_abYops - a_abY - b_abYops + b_abY) / 2 + dir
    );
  },
  // 在X轴上是包含关系
  isXWrap(
    a_abX: number,
    a_abXops: number,
    b_abX: number,
    b_abXops: number,
    dir = 0,
  ) {
    return (
      Math.abs((a_abX + a_abXops) / 2 - (b_abX + b_abXops) / 2) <=
      Math.abs(a_abXops - a_abX - b_abXops + b_abX) / 2 + dir
    );
  },
  // 相连关系
  isConnect(
    a_abX: number,
    a_abY: number,
    a_abXops: number,
    a_abYops: number,
    b_abX: number,
    b_abY: number,
    b_abXops: number,
    b_abYops: number,
    dir = 0,
  ) {
    return (
      this.isXConnect(a_abX, a_abXops, b_abX, b_abXops, dir) &&
      this.isYConnect(a_abY, a_abYops, b_abY, b_abYops, dir)
    );
  },
  // 水平方向相连
  isXConnect(
    a_abX: number,
    a_abXops: number,
    b_abX: number,
    b_abXops: number,
    dir = 0,
  ) {
    const aCx = (a_abX + a_abXops) / 2;
    const bCx = (b_abX + b_abXops) / 2;
    return (
      Math.abs(aCx - bCx) <= (a_abXops - a_abX + b_abXops - b_abX) / 2 + dir
    );
  },
  // 垂直方向相连
  isYConnect(
    a_abY: number,
    a_abYops: number,
    b_abY: number,
    b_abYops: number,
    dir = 0,
  ) {
    const aCy = (a_abY + a_abYops) / 2;
    const bCy = (b_abY + b_abYops) / 2;
    return (
      Math.abs(aCy - bCy) <= (a_abYops - a_abY + b_abYops - b_abY) / 2 + dir
    );
  },
};
