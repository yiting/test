//EM2M2模型：em2-m2
const EM2M2 = {
  name: "em2-m2",
  desc: "2元素模板：左文本+右标签",
  template: `
    <div :class="em2-m2" data-model="em2-m2" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
      <span :ref="0" :class="text"></span>
      <img :ref="1" :class="icon" :src="" occlusion="true"/>
    </div>`
};

module.exports = EM2M2;
