//E3M8模型：em3-m8
/* const E3M8 = {
  name: "em3-m8",
  desc: "3元素模板：左固定长度标签+右文字",
  template: `
    <div class="em3-m8" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="text"></span>
      <span :ref="1" :class="tag">
        <em :ref="2" :class="tag-text"></em>
      </span>
    </div>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class EM3M8 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="em3-m8" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="text"></span>
      <span $ref="1" class="tag">
        <em $ref="2" class="tag-text"></em>
      </span>
    </div>`
  }
}
module.exports = EM3M8;