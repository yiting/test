const SKETCH_LAYER_TYPES = {
  Artboard: 'artboard',
  Group: 'group',
  Bitmap: 'bitmap',
  Text: 'text',
  ShapeGroup: 'shapeGroup',
  SymbolInstance: 'symbolInstance',
  SymbolMaster: 'symbolMaster',
  Slice: 'slice',
  Rectangle: 'rectangle',
  Oval: 'oval',
  Line: 'line',
  Triangle: 'triangle',
  Polygon: 'polygon',
  Star: 'star',
  Rounded: 'rounded',
  Arrow: 'arrow',
  ShapePath: 'shapePath',
  get SHAPE_TYPES() {
    return [
      this.ShapeGroup,
      this.Rectangle,
      this.Oval,
      this.Line,
      this.Triangle,
      this.Polygon,
      this.Star,
      this.Rounded,
      this.Arrow,
      this.ShapePath,
    ];
  },
  get GROUP_TYPES() {
    return [this.Artboard, this.Group, this.SymbolInstance];
  },
};
const SKETCH_LAYER_QNODE = {
  artboard: 'QLayer',
  group: 'QLayer',
  bitmap: 'QImage',
  text: 'QText',
  shapeGroup: 'QShape',
  symbolInstance: 'QLayer',
  rectangle: 'QShape',
  oval: 'QShape',
  line: 'QShape',
  triangle: 'QShape',
  polygon: 'QShape',
  star: 'QShape',
  rounded: 'QShape',
  arrow: 'QShape',
  shapePath: 'QShape',
};
module.exports = { SKETCH_LAYER_TYPES, SKETCH_LAYER_QNODE };
