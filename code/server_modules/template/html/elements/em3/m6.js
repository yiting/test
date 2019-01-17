//E3M2模型：em3-m2
const E3M6 = {
  name: "em3-m6",
  desc: "3元素模板：左固定长度标签+右文字",
  template: `
    <div class="em3-m6" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="text"></span>
      <span :ref="1" :class="tag">
        <em :ref="2" :class="tag-text"></em>
      </span>
    </div>`
};

module.exports = E3M6;
