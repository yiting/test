//WG3M3模型：wg3-m3
const WG3M3 = {
  name: "wg3-m3",
  desc: "组件模型(3元素)：上图片+下文本1+下文本2",
  template: `
      <div :class="wg3-m3">
          <span :ref="0" :class="img"></span>
          <p :ref="1" :class="text1"></p>
          <p :ref="2" :class="text2"></p>
      </div>`
};

module.exports = WG3M3;
