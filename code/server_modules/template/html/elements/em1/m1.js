//EM1M1模型：em1-m1
const EM1M1 = {
  name: "em1-m1",
  desc: "1元素模板:单文本",
  template: `<span :ref="0" class="text"></span>`
};

module.exports = EM1M1;

class EM1M1 extends Template {
  constructor(data) {
    this.data = data;
  }
  get tpl() {
    return `<span :ref="0" :class="${this.className}"></span>`;
  }
  get className() {
    if (this.data.styles[0].size > 30) {
      return `title`;
    } else {
      return `text`;
    }
  }
}