/* //E3M2模型：em3-m2
const E3M2 = {
  name: "em3-m2",
  desc: "3元素模板：左固定长度标签+右文字",
  template: `
    <div class="em3-m2" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="2" :class="text"></span>
      <em :ref="0" :class="tag">
        <span :ref="1" :class="tag-text"></span>
      </em>
    </div>`
}; */
const Template = require('../../../template');
class EM3M2 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="em3-m2" :constraints='{"LayoutDirection": "Horizontal","LayoutJustifyContent": "Start"}'>
      <span $ref="2" class="text"></span>
      <em $ref="0" class="tag">
        <span $ref="1" class="tag-text"></span>
      </em>
    </div>`
  }
}
module.exports = EM3M2;