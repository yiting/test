//EM2M4模型：em2-m4
const EM2M4 = {
  name: "em2-m4",
  desc: "2元素模板：文本(QText)+QShape(上下布局)",
  template: `
      <div :class="em2-m4">
        <span :ref="0" :class="text"></span>
        <span :ref="1" :class="h-line"></span>
      </div>`
};

module.exports = EM2M4;
