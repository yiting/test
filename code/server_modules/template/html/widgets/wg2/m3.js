//WG2M3模型：wg2-m3
const WG2M3 = {
  name: "wg2-m3",
  desc: "组件模型(2元素)：上图标+下文本",
  template: `
    <div :class="wg2-m3" data-model="wg2-m3" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Vertical"}'>
        <img :ref="0" :class="icon" :src="" occlusion="true"/>
        <span :ref="1" :class="text"></span>
    </div>`
};

module.exports = WG2M3;
