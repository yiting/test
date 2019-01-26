/* //EM2M2模型：em2-m2
const EM2M2 = {
  name: "em2-m2",
  desc: "2元素模板：左文本+右标签",
  template: `
    <div class="information" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <p :ref="0" :class="text"></p>
      <span :ref="1" :class="icon"></span>
    </div>`
}; */
const Template = require('../../../template');
class EM2M2 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="information" @constraints>
      <p $ref="0" class="text"></p>
      <span $ref="1" class="icon"></span>
    </div>`
  }
  constraints(node) {
    node.constraints = {
      "LayoutDirection": "Horizontal",
      "LayoutJustifyContent": "Start"
    }
  }
}
module.exports = EM2M2;