//EM2M3模型：em2-m3
const EM2M3 = {
  name: "em2-m3",
  desc: "2元素模板：QShape+文本(QText)",
  template: `
    <div :ref="0" class="em2-m3">
       <span :ref="1" :class="text"></span>
    </div>`
};

module.exports = EM2M3;
