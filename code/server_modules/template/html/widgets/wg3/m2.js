//WG3M2模型：wg3-m2
const WG3M2 = {
  name: "wg3-m2",
  desc: "组件模型(3元素)：左大图+(上文本+下文本)",
  template: `
    <div :class="wg3-m2" data-model="wg3-m2" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <div :ref="0" :class="img" :style="background-image:url()" :constraints='{"LayoutSelfPosition":"Static","LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}'></div>
      <dl :class="content" :constraints='{"LayoutFlex":"Auto","LayoutPosition":"Static","LayoutDirection":"Vertical","LayoutJustifyContent":"Start"}'>
        <dd :ref="1" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
        <dd :ref="2" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
      </dl>
    </div>`
};

module.exports = WG3M2;
