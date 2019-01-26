//WG2M7模型：wg2-m7
/* const WG2M7 = {
  name: "wg2-m7",
  desc: "组件模型(2元素)：QImage+文本",
  template: `
    <div ref = "0": class = "img" class = "wg2-m7">
        <span :ref="1" :class="text"></span>
    </div>`
}; */
const Template = require('../../../template');
class WG2M7 extends Template {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `
    <div $ref="0" class="wg2-m7">
        <span $ref="1" class="text"></span>
    </div>`
    }
}

module.exports = WG2M7;