const {
  SKETCH_LAYER_TYPES,
  SKETCH_LAYER_QNODE,
} = require('./SketchLayerTypes');
const DesignTree = require('../../nodes/DesignTree');
const SketchMap = require('./sketch_map.js');

class SketchLayerParser {
  static init({ symbolMap, version, frameMap }) {
    this.SymbolMap = symbolMap;
    this.StyleParser = SketchMap.init_sketch(version);
    this.FrameMap = frameMap;
  }

  static parse(layer = {}) {
    // 隐藏的就不读出来
    if (!layer || !layer.isVisible) return null;

    // 共同的属性
    const { _class: layerType } = layer;
    let node = null; // 具体QObject
    // 根据不同类型初始化不同object
    if (SKETCH_LAYER_QNODE[layerType]) {
      node = DesignTree.createNode(SKETCH_LAYER_QNODE[layerType]);
    } else {
      if (layerType === 'slice') {
        node = DesignTree.createNode(null);
        node.type = 'slice';
      } else {
        console.log('遇到没有处理的类型: ', layerType);
        return null;
      }
    }
    this.setAttrByLayer(node, layer);
    return node;
  }

  static setAttrByLayer(node, layer) {
    let styles = {};
    // eslint-disable-next-line no-param-reassign
    node.id = layer.do_objectID;
    // eslint-disable-next-line no-param-reassign
    node.name = layer.name;
    const { height, width } = layer.frame;
    if (layer._class === SKETCH_LAYER_TYPES.SymbolInstance) {
      // Symbol解析样式
      // eslint-disable-next-line no-param-reassign
      layer = this.StyleParser.getLayerBySymbol(
        layer,
        this.SymbolMap[layer.symbolID],
      );
    }
    // if (layer._class != SKETCH_LAYER_TYPES.Bitmap) {
    //     styles = this.StyleParser.getStyle(layer); // 图片不解析样式
    // }
    styles = this.StyleParser.getStyle(layer);
    switch (layer._class) {
      case SKETCH_LAYER_TYPES.Artboard:
        // eslint-disable-next-line no-param-reassign
        node.bodyIndex = layer.index;
        break;
      case SKETCH_LAYER_TYPES.Bitmap:
        // 临时设置图片路径
        // eslint-disable-next-line no-param-reassign
        node.path = `${node.id}.png`;
        if (styles) {
          Object.assign(styles, {
            background: null,
            opacity: 1,
          });
        }
        break;
      case SKETCH_LAYER_TYPES.Text:
        // eslint-disable-next-line no-param-reassign
        node.text = layer.attributedString.string;
        break;
      default:
        if (~SKETCH_LAYER_TYPES.SHAPE_TYPES.indexOf(layer._class)) {
          // eslint-disable-next-line no-param-reassign
          node.shapeType = layer._class;
          break;
        }
    }

    const trimmed = this.FrameMap && this.FrameMap[node.id];
    Object.assign(node, {
      height: Math.round(height),
      width: Math.round(width),
      styles,
      _origin: {
        ...layer,
        trimmed,
      },
    });
  }
}
module.exports = SketchLayerParser;
