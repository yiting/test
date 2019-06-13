/* //WG3M2模型：wg3-m2
const WG3M2 = {
  name: "wg3-m2",
  desc: "组件模型(3元素)：左大图+(上文本+下文本)",
  template: `
    <div class="img-info" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="img"></span>
      <dl :class="content">
        <dd :ref="1" :class="text"></dd>
        <dd :ref="2" :class="subtext"></dd>
      </dl>
    </div>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class WG3M2 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="imgInfo" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <i $ref="0" class="icon" :style="'background-image:url('+this.requireImgPath(path)+')'"></i>
      <dl>
        <dd $ref="1" class="text"></dd>
        <dd $ref="2" class="subtext"></dd>
      </dl>
    </div>`
  }
}
module.exports = WG3M2;