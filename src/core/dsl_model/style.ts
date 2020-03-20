export class Background {
  constructor(o: Color | null) {}
}

export class LinearGradient {
  constructor(
    o: null | { x: number; y: number; x1: number; y1: number; colorStops: [] },
  ) {}
}
export class Border {
  constructor(o: null | { type: string; width: number; color: Color }) {}
}
export class Shadow {
  x: number;
  y: number;
  blur: number;
  color: Color;
  constructor(
    o: null | {
      x: number;
      y: number;
      blur: number;
      color: Color;
    },
  ) {
    this.x = o.x;
    this.y = o.y;
    this.blur = o.blur;
    this.color = o.color;
  }
}
export class BorderRadius {
  leftTop: number;
  rightTop: number;
  leftBottom: number;
  rightBottom: number;
  constructor(o: number[]) {
    this.leftTop = o[0];
    this.rightTop = o[1];
    this.leftBottom = o[2];
    this.rightBottom = o[3];
  }
}
export class Texts {
  constructor(o: any = {}) {}
}

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(rgba: { r: number; g: number; b: number; a: number }) {
    this.r = rgba.r;
    this.g = rgba.g;
    this.b = rgba.b;
    this.a = rgba.a;
  }
  hex() {
    let red = ('0' + this.r.toString(16)).slice(-2);
    let green = ('0' + this.g.toString(16)).slice(-2);
    let blue = ('0' + this.b.toString(16)).slice(-2);
    let alpha = Number(this.a * 255).toString(16);
    return `0x${alpha}${red}${green}${blue}`;
  }
}

export class Style {
  background: Background | LinearGradient;
  border: Border;
  shadow: Shadow;
  borderRadius: BorderRadius;
  texts: Texts;
  constructor(o: any = {}) {
    this.background =
      o.background && o.background.type == 'linear'
        ? new LinearGradient(o.background)
        : new Background(o.background);
    this.border = new Border(o.border);
    this.shadow = new Shadow(o.shadow);
    this.borderRadius = new BorderRadius(o.borderRadius);
    this.texts = new Texts(o.texts);
  }
}
