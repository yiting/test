//EM2M2模型：em2-m2
const EM2M2 = {
  name: "em2-m2",
  desc: "2元素模板：左文本+右标签",
  template: `
    <div :class="em2-m2" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="text"></span>
      <span :ref="1" :class="icon"></span>
    </div>`
};

module.exports = EM2M2;
