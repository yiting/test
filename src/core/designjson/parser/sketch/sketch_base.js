/**
 * sketch属性处理的基类，已50版本的处理方式为基础。
 * 其他版本的处理以这个为基础，如果不同，则重写对应方法
 */
const { SKETCH_LAYER_TYPES } = require('./SketchLayerTypes');
var myLog = function() {};
class Sketch {
  constructor() {
    //属性映射
    this.attrMap = SKETCH_LAYER_TYPES;
  }
  /**
   *
   * @param {JSON} attrMapJson 需要修正的属性映射
   */
  setAttrMap(attrMapJson) {
    myLog('INFO', '[Sketch-setAttrMap][modify]', JSON.stringify(attrMapJson));
    Object.assign(this.attrMap, attrMapJson);
  }
  /**
   *
   * @param {JSON} styleAttrJson
   */
  setReturnStyleAttr(styleAttrJson) {
    myLog(
      'INFO',
      '[Sketch-setReturnStyleAttr][modify]',
      JSON.stringify(styleAttrJson),
    );
    Object.assign(this.style, styleAttrJson);
  }
  /**
   * 主方法，用于返回平台所需要的sketch样式
   * 不同版本的如果属性有新增，则在这里重写新增assign进去
   * @param {JSON} layerObj  sketch的layer层JSON数据
   * @return {JSON} 返回封装好的styleJSON数据
   */
  getStyle(layerObj) {
    let resultObj = this._parseBaseStyle(layerObj);
    return Object.assign({}, resultObj);
  }
  getLayerBySymbol(symbolInstanceLayer, symbolMasterLayer) {
    const { width, height, x, y, do_Object, name } = symbolInstanceLayer.frame;
    let layer = {
      ...symbolMasterLayer,
      width,
      height,
      x,
      y,
      do_Object,
      name,
    };
    return layer;
  }
  /**
   * 主方法，用于解析平台所需要的sketch样式
   * @param {JSON} layerObj  sketch的layer层JSON数据
   */
  _parseBaseStyle(layerObj) {
    let canUserAttr = this._getCanUseAttr(layerObj);
    let canUserStyle = this._getCanUseStyle(canUserAttr.style);

    let background = null,
      shadows,
      border,
      borderRadius,
      opacity,
      rotation = canUserAttr.rotation;
    opacity = this._getOpcity(canUserAttr.style);
    //处理背景
    background = this._getBackground(
      canUserAttr.hasBackgroundColor,
      canUserAttr.backgroundColor,
      canUserStyle.fills,
    );

    //处理阴影样式
    shadows = this._getShadows([
      ...(canUserStyle.outterShadows || []),
      ...(canUserStyle.innerShadows || []),
    ]);
    myLog('INFO', '[Sketch-shadowsParse][Result]', JSON.stringify(shadows));
    //处理边框样式
    border = this._getBorder(canUserStyle.borders);
    myLog('INFO', '[Sketch-borderParse][Result]', JSON.stringify(border));
    //处理圆角样式
    borderRadius = this._getBorderRadius(
      canUserAttr._class,
      canUserAttr.points,
      canUserAttr.frame,
    );
    myLog(
      'INFO',
      '[Sketch-borderRadiusParse][Result]',
      JSON.stringify(borderRadius),
    );
    //将计算出来的属性合并到style
    const _styles = {
      borderRadius,
      border,
      opacity,
      rotation,
      shadows,
      background,
    };
    //文字做特殊处理
    switch (canUserAttr._class) {
      case this.attrMap.Text:
        let fontStyle = this._getFont(
          canUserStyle.textStyle,
          canUserAttr.attributedString,
          canUserAttr.frame.height,
        );
        this._mergeTextStyle(_styles, fontStyle);
        break;
    }
    return _styles;
  }
  /**
   * 从layer里筛选出需要的属性
   * @param {JSON} layerObj
   */
  _getCanUseAttr(layerObj) {
    /**
     * 筛选出需要暂时可利用的属性
     * _class->layer类型
     * style ->具体的样式，可以参考sketchJSON里的style字段
     * rotation->旋转
     * attributedStint->
     * frame->
     * points->
     * hasBackgroundColor->
     * backgroundColor->
     */
    const {
      _class,
      style,
      rotation,
      attributedString,
      frame,
      points,
      hasBackgroundColor,
      backgroundColor,
    } = layerObj;
    return Object.assign(
      {},
      {
        _class,
        style,
        rotation,
        attributedString,
        frame,
        points,
        hasBackgroundColor,
        backgroundColor,
      },
    );
  }
  /**
   * 从sketch央视里筛选出我们要用的央视
   * @param {JSON} style
   */
  _getCanUseStyle(style) {
    const {
      borders,
      shadows: outterShadows,
      innerShadows,
      fills,
      textStyle,
    } = style;
    return Object.assign(
      {},
      { borders, outterShadows, innerShadows, fills, textStyle },
    );
  }
  /**
   * 获取opcity样式
   * @param {JSON} style
   */
  _getOpcity(style) {
    //获取透明度
    const opacity = style.contextSettings
      ? (+style.contextSettings.opacity).toFixed(4)
      : 1;
    return opacity;
  }
  /**
   *
   * @param {String} _class
   * @param {JSON} points
   * @param {JSON} frame
   */
  _getBorderRadius(_class, points = [], frame) {
    if (_class === this.attrMap.Rectangle && points && points.length) {
      let radius = points.map(point => point.cornerRadius);
      if (radius.every(val => val === 0)) return null;
      else return radius;
    } else if (_class === this.attrMap.Oval) {
      // 圆形可以使用borderradius
      return ['50%', '50%', '50%', '50%'];
    }
    return null;
  }
  /**
   *
   * @param {Boolean} hasBackgroundColor
   * @param {*} backgroundColor
   * @param {*} fills
   */
  _getBackground(hasBackgroundColor, backgroundColor, fills) {
    let background = {
      type: 'image',
      color: null,
      hasOpacity: false,
    };
    if (hasBackgroundColor) {
      background.type = 'color';
      background.color = this._getColor(backgroundColor);
      return background;
    }
    if (fills && fills.length) {
      fills = fills.filter(({ isEnabled }) => !!isEnabled);
      if (!fills.length) return null;
      else if (fills.length > 1) return background;
      const fill = fills[0];
      const opacity = fill.contextSettings && fill.contextSettings.opacity;
      switch (fill.fillType) {
        case 0:
          {
            background.type = 'color';
            background.color = this._getColor(fill.color);
            if (background.color.a !== 1) background.hasOpacity = true;
          }
          break; // 纯色背景
        case 1:
          {
            const { stops, gradientType, elipseLength } = fill.gradient;
            if (gradientType === 0) {
              // 线性渐变
              background.type = 'linear';
            } else if (gradientType === 1) {
              // 径向渐变
              background.type = 'radical';
              background.r = elipseLength;
            }
            const [from, to] = [
              fill.gradient.from.slice(1, -1).split(','),
              fill.gradient.to.slice(1, -1).split(','),
            ];
            (background.x = from[0]),
              (background.y = from[1]),
              (background.x1 = to[0]),
              (background.y1 = to[1]);
            background.colorStops = stops.map(stop => {
              const color = this._getColor(stop.color);
              if (!isNaN(opacity)) color.a *= opacity; // 如果存在opacity，则与颜色alpha通道进行合并
              if (color.a !== 1) background.hasOpacity = true;
              return {
                color,
                offset: stop.position,
              };
            });
          }
          break; // 渐变
        default:
          break;
      }
      return background;
    } else return null;
  }
  /**
   *
   * @param {*} borders
   */
  _getBorder(borders) {
    // 获取边框 （坑点：多个边框叠加暂未考虑）
    if (!borders || !borders.length) return null;
    borders = borders.filter(({ isEnabled }) => !!isEnabled);
    if (!borders.length) return null;
    // border.position: 0 center, 1 inside, 2 outside
    return {
      type: 'solid',
      color: this._getColor(borders[0].color),
      width: borders[0].thickness,
      position: borders[0].position,
    };
  }
  /**
   *
   * @param {*} shadowList
   */
  _getShadows(shadowList) {
    shadowList = shadowList.filter(({ isEnabled }) => !!isEnabled);
    if (!shadowList.length) return null;
    return shadowList.map(
      ({ _class, offsetX: x, offsetY: y, spread, blurRadius: blur, color }) => {
        const type = _class === 'shadow' ? 'inset' : 'initial';
        return {
          type,
          x,
          y,
          color: this._getColor(color),
          spread,
          blur,
        };
      },
    );
  }
  /**
   *
   * @param {*} color
   */
  _getColor(color) {
    if (!color) return null;
    let { alpha, blue, green, red } = color;
    return {
      r: Math.round(red * 255),
      g: Math.round(green * 255),
      b: Math.round(blue * 255),
      a: alpha,
    };
  }
  /**
   *
   * @param {*} textStyle
   * @param {*} attributedString
   */
  _getFont(textStyle, attributedString) {
    const textValue = attributedString.string;
    let fontStyle = function(ops = {}) {
      let {
        color = { r: 0, g: 0, b: 0, a: 1 },
        string = '',
        font,
        size = 18,
      } = ops;
      this.color = color;
      this.string = string;
      this.font = font;
      this.size = size;
    };
    const texts = attributedString.attributes.map(text => {
      const {
        name: fontName,
        size,
      } = text.attributes.MSAttributedStringFontAttribute.attributes;
      return new fontStyle({
        color: this._getColor(text.attributes.MSAttributedStringColorAttribute),
        string: textValue.slice(text.location, text.location + text.length),
        // fontWeight: name.slice(0,2), // TODO
        font: fontName,
        size,
      });
    });
    if (!textStyle) return { texts };
    const { verticalAlignment: verticalAlign, encodedAttributes } = textStyle;
    if (!encodedAttributes.paragraphStyle) return { texts, verticalAlign };
    return {
      texts,
      verticalAlign,
      textAlign: encodedAttributes.paragraphStyle.alignment || 0,
      lineHeight: encodedAttributes.paragraphStyle.maximumLineHeight || null,
    };
  }
  _mergeTextStyle(styles = {}, fontStyle) {
    let { background, shadows } = styles;
    if (background) {
      styles.background = null;
      if (background.type === 'color')
        fontStyle.texts.forEach(s => (s.color = background.color));
    }
    if (shadows) {
      styles.shadows = null;
      fontStyle.textShadows = shadows;
    }
    myLog('INFO', '[Sketch-fontParse][Result]', JSON.stringify(fontStyle));
    Object.assign(styles, fontStyle);
  }
}

// 对外接口
module.exports = Sketch;
