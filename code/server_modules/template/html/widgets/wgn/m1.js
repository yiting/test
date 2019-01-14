//WGNM1模型：cycle-01
const WGNM1 = {
    name: "cycle-01",
    desc: "组件模型(5元素)：左三图+(上文本+下文本)",
    template: `
          <ul :class="list">
            <repeat>
              <li :ref="n">
              </li>
            </repeat>
          </ul>`
  };
  
  module.exports = WGNM1;
  