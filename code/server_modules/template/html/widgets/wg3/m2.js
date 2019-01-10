//WG3M2模型：wg3-m2
const WG3M2 = {
  name: "wg3-m2",
  desc: "组件模型(3元素)：左大图+(上文本+下文本)",
  template: `
    <div class="wg3-m2" :constraints='{"LayoutDirection":"Horizontal", "LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="img"></span>
      <dl :class="content">
        <dd :ref="1" :class="text1"></dd>
        <dd :ref="2" :class="text2"></dd>
      </dl>
    </div>`
};

module.exports = WG3M2;
