//E3M3模型：em3-m3
const E3M3 = {
  name: "em3-m3",
  desc: "3元素模板：左固定长度标签+右文字",
  template: `
    <div class="em3-m3" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="tag">
        <em :ref="1" :class="tag-text"></em>
      </span>
      <span :ref="2" :class="text"></span>
    </div>`
};

module.exports = E3M3;
