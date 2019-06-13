const Sketch = require('./sketch_base');
console.log(Sketch);
var myLog = function() {};
class Sketch50 extends Sketch {
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
      canUserAttr.includeBackgroundColorInInstance,
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
   *
   * @param {Boolean} hasBackgroundColor
   * @param {*} backgroundColor
   * @param {*} fills
   * @param {Boolean} includeBackgroundColorInInstance
   */
  _getBackground(
    hasBackgroundColor,
    backgroundColor,
    fills,
    includeBackgroundColorInInstance,
  ) {
    const background = {
      type: 'image',
      color: null,
      hasOpacity: false,
    };
    if (hasBackgroundColor) {
      if (includeBackgroundColorInInstance === false) return null;
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
    }
    return null;
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
      includeBackgroundColorInInstance,
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
        includeBackgroundColorInInstance,
      },
    );
  }

  getLayerBySymbol(syiLayer, symLayer) {
    // const {width,height,x,y} = syiLayer.frame;
    let layer = {
      ...symLayer,
      ...syiLayer,
    };
    let overrideValues = layer['overrideValues'];
    if (!Array.isArray(overrideValues)) return layer;
    layer = JSON.parse(JSON.stringify(layer));
    overrideValues.forEach(item => {
      let [id, key] = item.overrideName.split('_');
      let overwriteLayer = this._getLayerById(id, layer.layers);
      if (!overwriteLayer) return null;
      switch (key) {
        case 'stringValue':
          {
            let { string: txt_string, attributes: txt_attrs } = overwriteLayer[
              'attributedString'
            ];
            if (txt_string)
              overwriteLayer['attributedString']['string'] = item.value;
            if (txt_attrs)
              overwriteLayer['attributedString']['attributes'] = [txt_attrs[0]];
          }
          break;
        default:
          break;
      }
    });
    return layer;
  }

  _getLayerById(id, layers) {
    if (!Array.isArray(layers)) return null;
    const layer = layers.find(l => l.do_objectID === id);
    if (layer) return layer;
    for (const item of layers) {
      const la = this._getLayerById(id, item.layers);
      if (la) return la;
    }
    return null;
  }
}
// 对外接口
module.exports = Sketch50;
