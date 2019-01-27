//EM1M1模型：em1-m1
/* const EM1M1 = {
  name: "em1-m1",
  desc: "1元素模板:单文本",
  template: `<span :ref="0" class="text"></span>`
}; */
const Template = require('../../../template');
class EM1M1 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `<span :class="className()"></span>`
  }
  className(node){
    if(node.styles.texts[0].size>30){
      return 'title'
    }
    return 'text'

  }
}

module.exports = EM1M1;