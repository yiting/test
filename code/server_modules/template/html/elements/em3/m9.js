//E3M9模型：em3-m9
const E3M9 = {
  name: "em3-m9",
  desc: "3元素模板：左文本+中Shape+右文本",
  template: `
    <div class="em3-m9" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
       <span :ref="0" :class="text"></span>
       <span :ref="1" :class="v-line"></span>
       <span :ref="2" :class="text"></span>
    </div>`
};

module.exports = E3M9;
