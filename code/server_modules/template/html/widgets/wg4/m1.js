//WG4M1模型：wg4-m1
const WG4M1 = {
  name: "wg4-m1",
  desc: "组件模型(4元素)：左大图+(上文本+中文本+下文本)",
  template: `
    <div :class="wg4-m1" data-model="wg4-m1" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <div :ref="0" :class="img" :style="background-image:url()" :constraints='{"LayoutSelfPosition":"Static","LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}'></div>
      <dl :class="content" :constraints='{"LayoutFlex":"Auto","LayoutPosition":"Static","LayoutDirection":"Vertical","LayoutJustifyContent":"Start"}'>
        <dd :ref="1" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd :ref="2" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd :ref="3" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`
};

module.exports = WG4M1;