//WG4M2模型：wg4-m2
const WG4M2 = {
  name: "wg4-m2",
  desc: "组件模型(4元素)：上(左大图+中大图+右大图)+下文本",
  template: `
    <div class="wg4-m2">
      <ul :class="content" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <li :ref="0" :class="img1" :constraints='{"LayoutFlex":"Auto"}'></li>
        <li :ref="1" :class="img2" :constraints='{"LayoutFlex":"Auto"}'></li>
        <li :ref="2" :class="img3" :constraints='{"LayoutFlex":"Auto"}'></li>
      </ul>
      <p :ref="3" :class="text"></p>
    </div>`
};

module.exports = WG4M2;
