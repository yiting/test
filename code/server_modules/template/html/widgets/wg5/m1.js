//WG5M1模型：wg5-m1
const WG5M1 = {
  name: "wg5-m1",
  desc: "组件模型(5元素)：左三图+(上文本+下文本)",
  template: `
      <div class="img-desc" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <ul :class="content" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <li :ref="0" :class="img1" :constraints='{"LayoutFlex":"Auto"}'></li>
            <li :ref="1" :class="img2" :constraints='{"LayoutFlex":"Auto"}'></li>
            <li :ref="2" :class="img3" :constraints='{"LayoutFlex":"Auto"}'></li>
        </ul>
        <dl :class="content" :constraints='{"LayoutFlex":"Auto","LayoutJustifyContent":"Start"}'>
          <dd :ref="3" :class="text1" :constraints='{"LayoutFlex":"Auto"}'></dd>
          <dd :ref="4" :class="text2" :constraints='{"LayoutFlex":"Auto"}'></dd>
        </dl>
      </div>`
};

module.exports = WG5M1;
