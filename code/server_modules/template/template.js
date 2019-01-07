//加载所有模板
const TEMPLATE_LIST = require("./templatelist");
/**
 * 模板类
 */
class Template {
  constructor() {}
  /**
   *根据模型类型或终端类型获取对应的模板字符串
   * @param {*} modelType
   * @param {*} deviceType
   */
  static getTemplate(modelType, deviceType = "html") {
    let modelTemplate = "";
    TEMPLATE_LIST.forEach((template, i) => {
      if (modelType == template.name) {
        modelTemplate = TEMPLATE_LIST[i].template;
      }
    });
    return modelTemplate;
  }
}

module.exports = Template;
