/* //WG3M3模型：wg3-m3
const WG3M3 = {
  name: "wg3-m3",
  desc: "组件模型(3元素)：上图片+下文本1+下文本2",
  template: `
      <div class="img-desc">
          <span :ref="0" :class="img"></span>
          <p :ref="1" :class="text"></p>
          <p :ref="2" :class="subtext"></p>
      </div>`
}; */
const HtmlTemplate = require('../../htmlTemplate');
class WG3M3 extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `
      <div class="img-desc">
          <span $ref="0" class="img"></span>
          <p $ref="1" class="text"></p>
          <p $ref="2" class="subtext"></p>
      </div>`
    }
}
module.exports = WG3M3;