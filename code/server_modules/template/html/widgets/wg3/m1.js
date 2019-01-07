//WG3M1模型：wg3-m1
const WG3M1 = {
    name: "wg3-m1",
    desc: "组件模型(3元素)：左图标+(上文本+下文本)",
    template: `
      <div :class="wg3-m1" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
        <span :ref="0" :class="icon"></span>
        <dl>
          <dd :ref="1" :class="text1"></dd>
          <dd :ref="2" :class="text2"></dd>
        </dl>
      </div>`
  };
  
  module.exports = WG3M1;
  