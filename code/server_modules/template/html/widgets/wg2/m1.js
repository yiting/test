//WG2M1模型：wg2-m1
const WG2M1 = {
  name: "wg2-m1",
  desc: "2元素模板：左Icon+右文字",
  template: `
    <div :class="wg2-m1" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="icon"></span>
      <p :ref="1" :class="text"></p>
    </div>`
};

module.exports = WG2M1;