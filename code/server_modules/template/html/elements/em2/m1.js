//EM2M1模型：em2-m1
const EM2M1 = {
  name: "em2-m1",
  desc: "2元素模板：左标签+右文本",
  template: `
    <div :class="em2-m1" data-model="em2-m1" :constraints='{"LayoutPosition":"Static","LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
        <img :ref="0" :class="icon" :src="" occlusion="true"/>
        <span :ref="1" :class="text"></span>
    </div>`
};

module.exports = EM2M1;
