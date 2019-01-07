//WG2M3模型：wg2-m3
const WG2M3 = {
  name: "wg2-m3",
  desc: "组件模型(2元素)：上图标+下文本",
  template: `
    <div :class="wg2-m3">
        <span :ref="0" :class="icon"></span>
        <p :ref="1" :class="text"></p>
    </div>`
};

module.exports = WG2M3;
