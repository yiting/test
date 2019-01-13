//WGNM1模型：cycle-01
const WGNM1 = {
    name: "cycle-01",
    desc: "组件模型(5元素)：左三图+(上文本+下文本)",
    template: `
          <ul :class="list" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <repeat>
              <li :constraints='{"LayoutFlex":"Auto"}'>
                <div :ref="n"></div>
              </li>
            </repeat>
          </ul>`
  };
  
  module.exports = WGNM1;
  