//WG3M1模型：wg3-m1
const WG3M1 = {
    name: "wg3-m1",
    desc: "组件模型(3元素)：左图标+(上文本+下文本)",
    template: `
      <div :class="wg3-m1" data-model="wg3-m1" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <img :ref="0" :class="icon" :constraints='{"LayoutSelfPosition":"Static","LayoutSelfHorizontal":"Left","LayoutFixedWidth":"Fixed","LayoutFixedHeight":"Fixed"}' occlusion="true"/>
        <dl :class="content" :constraints='{"LayoutFlex":"Auto","LayoutPosition":"Static","LayoutDirection":"Vertical","LayoutJustifyContent":"Start"}'>
          <dd :ref="1" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
          <dd :ref="2" :class="text" :constraints='{"LayoutFlex":"Auto"}'></dd>
        </dl>
      </div>`
  };
  
  module.exports = WG3M1;
  