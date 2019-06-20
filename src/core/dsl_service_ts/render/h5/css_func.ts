const Funcs = {
  // 找到获取最接近的model
  getClosestModelById(node: any, id: string): any {
    // try {
    if (!id || !node) {
      return null;
    }
    if (id === node.id) {
      return node;
    }
    return Funcs.getClosestModelById(node.parent, id);
    // } catch (e) {
    // Loger.error(`css_dom.js [getClosestModelById],params:[id:${id}]`)
    // }
  },
  getRGBA(color: any) {
    if (color && typeof color === 'object') {
      return `rgba(${[color.r, color.g, color.b, color.a].join(',')})`;
    }
    return null;
  },
  borderType(style: any) {
    if (!style) {
      return 'solid';
    }
    if (style.dash > 4) {
      return 'dashed';
    }
    if (style.dash > 1) {
      return 'dotted';
    }
    return 'solid';
  },
  /**
   *
   * @param {Array} vals 圆角数组
   * @param {Number} maxSize 圆角最大值
   */
  getRadius(_vals: any, maxSize = 100) {
    const that = this;
    let vals: any = _vals;
    if (!(vals instanceof Array)) {
      vals = [vals];
    }
    return vals
      .map((_v: number | string) => {
        let v = _v;
        if (typeof v === 'number') {
          v = v < maxSize / 2 ? v : maxSize / 2;
          return Funcs.transUnit(v);
        }
        return v;
      })
      .join(' ');
  },
  transUnit(_number: any, _unit: any = 'rem') {
    let number: any = parseInt(_number, 10) || 0;
    let unit: any = _unit;
    const dpr = 2;
    // 1-2像素特殊处理
    if (Math.abs(number) <= dpr) {
      number = Math.ceil(number / dpr);
      unit = 'px';
    }
    if (unit === 'rem') {
      return `${number / 100}rem`;
    }
    return `${number}px`;
  },
  /**
   * 获取线性渐变值
   * @param {Color} bgColor 背景色
   * @param {Number} width 宽度
   * @param {Number} height 高度
   */
  getLinearGradient(bgColor: any, width: number, height: number) {
    const from = {
      x: bgColor.x * width,
      y: bgColor.y * height,
    };
    const to = {
      x: bgColor.x1 * width,
      y: bgColor.y1 * height,
    };
    const stops: any[] = [];
    const rad = Math.atan((from.y - to.y) / (to.x - from.x));
    let angle = (rad * 180) / Math.PI;
    angle += from.x > to.x ? -180 : 0;
    const isHorizontal = angle % 180 === 0;
    bgColor.colorStops.forEach((stop: any) => {
      stops.push({
        color: Funcs.getRGBA(stop.color),
        offset: stop.offset,
      });
    });
    const gradientLength = Math.abs(
      isHorizontal ? width / Math.cos(rad) : height / Math.sin(rad),
    );
    const dirX = (to.x - from.x) ** 2;
    const dirY = (to.y - from.y) ** 2;
    const linearLength = Math.sqrt(dirX + dirY);
    const w = from.x < to.x ? from.x : width - from.x;
    const h = from.y < to.y ? from.y : height - from.y;
    const beginLength = Math.abs(
      isHorizontal ? w / Math.cos(rad) : h / Math.sin(rad),
    );
    stops.forEach((_s: any) => {
      const s: any = _s;
      s.offset = (s.offset * linearLength + beginLength) / gradientLength;
    });
    return `-webkit-linear-gradient(${angle}deg, ${stops
      .map(s => `${s.color} ${s.offset * 100}%`)
      .join(',')})`;
  },
};

export default Funcs;