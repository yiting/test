/* //EM1M2模型：em1-m2
const EM1M2 = {
  name: "em1-m2",
  desc: "1元素模板:单icon",
  template: `<span :ref="0" :class="icon"></span>`
};
module.exports = EM1M2; */
const Template = require('../../../template');
class EM1M2 extends Template {
  constructor() {
    super(...arguments);
  }
  get template() {
    return `<span class="icon"></span>`
  }
}

module.exports = EM1M2;