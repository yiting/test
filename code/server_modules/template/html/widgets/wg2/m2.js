/* //WG2M2模型：wg2-m2
const WG2M2 = {
  name: "wg2-m2",
  desc: "2元素模板：左文本+右标签",
  template: `
    <div class="information" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <p :ref="0" :class="text"></p>
      <span :ref="1" :class="icon"></span>
    </div>`
}; */
const Template = require('../../../template');
class WG2M2 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="information" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <p $ref="0" class="text"></p>
      <span $ref="1" class="icon"></span>
    </div>`
  }
}

module.exports = WG2M2;