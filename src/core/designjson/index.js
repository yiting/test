// 1.引入parser模块
const ParserModule = require('./parser');
const Optimize = require('./optimize');
const Processor = require('./processor');

const FILE_TYPES = {
  Sketch: 'sketch',
  Psd: 'psd',
  Xd: 'xd',
};
class DesignJson {
  /**
   *
   * @param {string} fileType 设计稿类型
   * @param {Object} data
   * @param {Array.<Object>} data.pages
   * @param {Object} data.documentJson
   * @param {string} data.filePath 文件地址
   * @return {Object} 设计稿源数据处理信息
   */
  static init(fileType = 'sketch', data) {
    if (!~Object.values(FILE_TYPES).indexOf(fileType)) return null;
    return ParserModule[fileType].init(data);
  }

  /**
   * artboard抽象
   * @param {string} artBoardId artboard id
   * @param {Object} option 优化配置
   * @param {Object} options.symbolMap
   * @param {Object} options.artboardMap
   * @param {string} options.version
   * @param {Object} options.frameMap
   * @param {Object} option.aiData ai数据
   * @param {Object} option.ruleMap 合图规则
   * @return {Object} 返回节点与图片节点
   */
  static parse(artBoardId, option = {}, fileType = 'sketch') {
    const designDom = ParserModule[fileType].parse(artBoardId, option);
    Optimize(designDom, option);
    Processor[fileType].removeRepeat(designDom);
    const nodes = designDom.toList();
    const images = designDom.getImages();
    const rate =
      Array.isArray(nodes) && nodes.length ? nodes[0].width / 750 : null;
    return {
      nodes,
      images,
      rate,
    };
  }
}
module.exports = DesignJson;
