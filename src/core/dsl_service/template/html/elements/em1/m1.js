//EM1M1模型：em1-m1
/* const EM1M1 = {
  name: "em1-m1",
  desc: "1元素模板:单文本",
  template: `<span :ref="0" class="text"></span>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class EM1M1 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `<span :class="textClassName()"></span>`
  }
}

module.exports = EM1M1;