//WG4M3模型：wg4-m3
const WG4M3 = {
  name: "wg4-m3",
  desc: "组件模型(4元素)：左(左大图+中大图+右大图)+右文本",
  template: `
  <div :class="wg4-m3" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
    <ul :class="imglist" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <li :ref="0" :class="img"></li>
        <li :ref="1" :class="img"></li>
        <li :ref="2" :class="img"></li>
    </ul>
    <p :ref="3" class="text"></p>
  </div>`
};

module.exports = WG4M3;
