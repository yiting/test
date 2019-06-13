/* //WG4M1模型：wg4-m1
const WG4M1 = {
  name: "wg4-m1",
  desc: "组件模型(4元素)：左大图+(上文本+中文本+下文本)",
  template: `
    <div class="img-info" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="img" :constraints='{"LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}'></span>
      <dl :class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
        <dd :ref="1" :class="text1" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd :ref="2" :class="text2" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd :ref="3" :class="text3" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`
}; */
// const HtmlTemplate = require('../../htmlTemplate');
const HtmlTemplate = require('../../htmlTemplate');
class WG4M1 extends HtmlTemplate {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `
    <div class="imgInfo" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <img $ref="0" class="img" :constraints='{"LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}' :src="this.requireImgPath(path)"/>
      <dl class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
        <dd $ref="1" class="primary" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="2" class="info" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd $ref="3" class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`
  }
}
module.exports = WG4M1;