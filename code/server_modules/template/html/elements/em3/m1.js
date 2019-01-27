/* //E3M9模型：em3-m1
const E3M1 = {
  name: "em3-m1",
  desc: "3元素模板：左固定长度标签+右文字",
  template: `
    <div class="em3-m1" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="tag">
        <em :ref="1" :class="tag-text"></em>
      </span>
      <span :ref="2" :class="text"></span>
    </div>`
}; */
const Template = require('../../../template');
class EM3M1 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="em3-m1" :constraints="this.constraints">
      <span $ref="0" class="tag">
        <em $ref="1" class="tag-text"></em>
      </span>
      <span $ref="2" class="text"></span>
    </div>`
  }
  get constraints() {
    return {
      "LayoutDirection": "Horizontal",
      "LayoutJustifyContent": "Start"
    }
  }
}

module.exports = EM3M1;