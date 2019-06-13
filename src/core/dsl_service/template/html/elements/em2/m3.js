/* //EM2M3模型：em2-m3
const EM2M3 = {
  name: "em2-m3",
  desc: "2元素模板：QShape+文本(QText)",
  template: `
    <div :ref="0" class="btn">
       <span :ref="1" :class="text"></span>
    </div>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class EM2M3 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="tag">
      <i $ref="1"></i>
      <span $ref="0" class="text"></span>
    </div>`
  }
}

module.exports = EM2M3;