/* //EM1M3模型：em1-m3
const EM1M3 = {
  name: "em1-m3",
  desc: "1元素模板：单背景图",
  template: `<span :ref="0" :class="img"></span>`
};
module.exports = EM1M3; */


const HtmlTemplate = require('../../htmlTemplate');
class EM1M3 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `<span class="img"></span>`
  }
}

module.exports = EM1M3;