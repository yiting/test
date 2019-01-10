//WG2M4模型：wg2-m4
const WG2M4 = {
  name: "wg2-m4",
  desc: "两元素模板：上背景图+下文本",
  template: `
    <div class="wg2-m4" :constraints='{"LayoutJustifyContent":"Start"}'>
        <span :ref="0" :class="img"></span>
        <p :ref="1" :class="text"></p>
    </div>`
};

module.exports = WG2M4;
