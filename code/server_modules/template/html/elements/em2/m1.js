//EM2M1模型：em2-m1
const EM2M1 = {
  name: "em2-m1",
  desc: "2元素模板：左标签+右文本",
  template: `
    <div class="em2-m1" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
        <span :ref="0" :class="icon"></span>
        <p :ref="1" :class="text"></p>
    </div>`
};

module.exports = EM2M1;
