// 1.引入parser模块
const ParserModule = require('./parser');
const Optimize = require('./optimize');
const Processor = require('./processor');
const { extractDom } = require('./utils');

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
   * @param {string} fileType 设计稿类型
   * @param {Object} option 优化配置
   * @param {Object} options.symbolMap
   * @param {Object} options.artboardMap
   * @param {string} options.version
   * @param {Object} options.fontData
   * @param {Object} options.frameMap
   * @param {Object} option.aiData ai数据
   * @param {Object} option.ruleMap 合图规则
   * @param {boolean} option.isPreedit 是否人工合图步骤
   * @return {Object} 返回节点与图片节点
   */
  static parse(artBoardId, fileType = 'sketch', option = {}) {
    const designDom = ParserModule[fileType].parse(artBoardId, option);
    const rate = designDom ? designDom.width / 750 : null;
    option.rate = rate;
    Optimize(designDom, option);
    option.isPreedit && Processor[fileType].process(designDom);
    Processor.process(designDom);
    const nodes = designDom.toList();
    const images = designDom.getImages();
    return {
      nodes,
      images,
      rate,
    };
  }

  /**
   * artboard抽象
   * @param {string} artBoardId artboard id
   * @param {Object} option 优化配置
   * @param {Object} options.symbolMap
   * @param {Object} options.artboardMap
   * @param {string} options.version
   * @param {Object} options.fontData
   * @param {Object} options.frameMap
   * @param {Object} option.aiData ai数据
   * @param {Object} option.ruleMap 合图规则
   * @param {boolean} option.isPreedit 是否人工合图步骤
   * @return {Object} 返回节点
   */
  static pureParse(artBoardId, fileType = 'sketch', option = {}) {
    const designDom = ParserModule[fileType].parse(artBoardId, option);
    const allNodes = designDom.toList();
    const nodes = allNodes.filter(n => n.type !== 'QLayer');
    nodes.unshift(allNodes[0]);
    return {
      nodes,
    };
  }
  /**
   * artboard抽象
   * @param {string} artBoardId artboard id
   * @param {string[]} idList idList id
   * @param {Object} option 优化配置
   * @param {Object} options.symbolMap
   * @param {Object} options.artboardMap
   * @param {string} options.version
   * @param {Object} options.fontData
   * @param {Object} options.frameMap
   * @param {Object} option.aiData ai数据
   * @param {Object} option.ruleMap 合图规则
   * @param {boolean} option.isPreedit 是否人工合图步骤
   * @return {Object} 返回节点与图片节点
   */
  static localParse(artBoardId, fileType, idList = [], option = {}) {
    if (!Array.isArray(idList) || idList.length < 1) throw 'idList参数错误';
    const designDom = ParserModule[fileType].parse(artBoardId, option);
    const rate = designDom ? designDom.width / 750 : null;
    option.rate = rate;
    extractDom(designDom, idList);
    Optimize(designDom, option);
    Processor.process(designDom, option);
    const nodes = designDom.toList().slice(1); // 去掉根节点
    const images = designDom.getImages();
    return {
      nodes,
      images,
      rate,
    };
  }
}
module.exports = DesignJson;
