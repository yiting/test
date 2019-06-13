/* //E3M9模型：em3-m1
const E3M7 = {
  name: "em3-m7",
  desc: "3元素模板：左可变长度标签+右文字",
  template: `
    <div class="em3-m7" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="tag">
        <em :ref="1" :class="tag-text"></em>
      </span>
      <span :ref="2" :class="text"></span>
    </div>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class EM3M7 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="em3-m7" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span $ref="0" class="tag">
        <em $ref="1" class="tag-text"></em>
      </span>
      <span $ref="2" class="text"></span>
    </div>`
  }
}
module.exports = EM3M7;
