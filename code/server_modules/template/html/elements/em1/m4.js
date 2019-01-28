/* //EM1M3模型：em1-m4
const EM1M4 = {
  name: "em1-m4",
  desc: "1元素模板：纯色Shape背景",
  template: `<div :ref="0" :class="shape"></div>`
};
module.exports = EM1M4; */


const HtmlTemplate = require('../../htmlTemplate');
class EM1M4 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `<span class="shape"></span>`
  }
}

module.exports = EM1M4;