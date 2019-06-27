const { SKETCH_LAYER_TYPES } = require('./SketchLayerTypes');
const SketchLayerParser = require('./SketchLayerParser');
const SketchProcessor = require('./SketchProcessor');
const getSketchRect = require('./SketchRect');
// const dsl = require('../../../dsl2/dsl');
/**
 * sketch文件解析器
 */
class SketchParser {
  /**
   * sketch解析初始化
   * @param {Array.<Object>} pages
   * @param {Object} documentJson
   */
  static init({ pages = [], documentJson = {}, filePath = '', version = '' }) {
    if (!Array.isArray(pages) || !pages.length) return null;
    let frameMap = null;
    // if (filePath) frameMap = getSketchRect(filePath);
    const symbolMap = this._getSymbolMap(pages, documentJson); // 获取Symbol字典
    const artboardMap = this._getArtboardMap(pages);
    return {
      pageInfo: this._getArtboardInfo(artboardMap),
      data: {
        symbolMap,
        artboardMap,
        frameMap,
        version,
      },
    };
  }

  static _getArtboardInfo(artboardMap) {
    const list = [];
    Object.values(artboardMap).forEach(layer => {
      if (!layer || !layer.page) return;
      let pageObj = list.find(item => item.id === layer.page.id);
      if (!pageObj) {
        pageObj = {
          ...layer.page,
          artboards: [],
        };
        list.push(pageObj);
      }
      pageObj.artboards.push({
        id: layer.do_objectID,
        name: layer.name,
      });
    });
    return list;
  }

  /**
   * 解析artboard
   * @param {string} artboardId
   * @param {Object} options
   * @param {Object} options.symbolMap
   * @param {Object} options.artboardMap
   * @param {string=} options.version
   * @param {Object} options.frameMap
   */
  static parse(
    artboardId,
    { symbolMap = {}, artboardMap, version = '', frameMap },
  ) {
    SketchLayerParser.init({ symbolMap, artboardMap, version, frameMap }); // 将Symbol字典注入layer解析器
    const artboardLayer = artboardMap[artboardId];
    const rootNode = this._parseLayer(artboardLayer, {
      levelArr: [],
      childIndex: artboardLayer.childIndex,
    });
    SketchProcessor.process(rootNode);
    return rootNode;
  }

  static _parseLayer(layer, data = { levelArr: [], childIndex: 0 }) {
    const node = SketchLayerParser.parse(layer);

    if (node) {
      const { levelArr, childIndex } = data;
      node.levelArr = [...levelArr, childIndex];
    } else return node;
    // eslint-disable-next-line no-param-reassign
    layer = node._origin;
    // 继续递归
    if (~SKETCH_LAYER_TYPES.GROUP_TYPES.indexOf(layer._class)) {
      const sublayers = layer.layers;
      sublayers.forEach((sblayer, index) => {
        const child = this._parseLayer(sblayer, {
          levelArr: node.levelArr,
          childIndex: index,
        });
        if (child) {
          node.add(child);
        }
      });
    }
    return node;
  }

  /**
   * 获取Artboard字典
   * @param {Array.<Object>} pageList
   */
  static _getArtboardMap(pageList) {
    const obj = {};
    for (const json of pageList) {
      json.layers.forEach((layer, index) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { do_objectID, _class, layers } = layer;
        if (_class === SKETCH_LAYER_TYPES.Artboard && layers.length) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          obj[do_objectID] = layer;
          obj[do_objectID].childIndex = index;
          obj[do_objectID].page = {
            id: json.do_objectID,
            name: json.name,
          };
        }
      });
    }
    return obj;
  }

  /**
   * 获取Symbol字典
   * @param {Array.<Object>} pageList
   * @param {Object} documentJson
   */
  static _getSymbolMap(pageList, documentJson) {
    const symbolMasterLayerMap = this._getSymbolMasterLayerMap(pageList);
    const foreinSymbolMasterLayerMap = this._getForeinSymbolMasterLayerMap(
      documentJson,
    );
    const smap = {
      ...symbolMasterLayerMap,
      ...foreinSymbolMasterLayerMap,
    };
    Object.values(smap).forEach(slayer => {
      const list = [];
      symbolList(slayer.layers, list);
      // let identity = dsl.getSymbolIdentity(list)
      // slayer.identity = identity;
    });
    return smap;
  }

  static _getSymbolMasterLayerMap(inputList = []) {
    const obj = {};
    let arr = [];
    for (const json of inputList) {
      arr = arr.concat(
        json.layers.filter(
          layer => layer._class === SKETCH_LAYER_TYPES.SymbolMaster,
        ),
      );
    }
    // eslint-disable-next-line no-return-assign
    arr.forEach(layer => (obj[layer.symbolID] = layer));
    return obj;
  }

  static _getForeinSymbolMasterLayerMap(json = {}) {
    const obj = {};
    if (!json.foreignSymbols || !json.foreignSymbols.length) return null;
    const arr = json.foreignSymbols
      .filter(o => o.symbolMaster._class === SKETCH_LAYER_TYPES.SymbolMaster)
      .map(o => o.symbolMaster);
    // eslint-disable-next-line no-return-assign
    arr.forEach(layer => (obj[layer.symbolID] = layer));
    return obj;
  }
}
function symbolList(layers, list) {
  if (!layers || !layers.length) return;

  layers.forEach(l => {
    list.push({
      _class: l._class,
      frame: l.frame,
    });
    symbolList(l.layers, list);
  });
}
module.exports = SketchParser;
