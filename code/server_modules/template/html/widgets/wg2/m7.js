//WG2M7模型：wg2-m7
const WG2M7 = {
  name: "wg2-m7",
  desc: "组件模型(2元素)：QImage+文本",
  template: `
    <div :ref="0" :class="wg2-m7" :style="background-image:url()" data-model="wg2-m7" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Center","LayoutAlignItems":"Center"}'>
        <span :ref="1" :class="text"></span>
    </div>`
};

module.exports = WG2M7;
