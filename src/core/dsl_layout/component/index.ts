import WidgetModelProcess from '../../dsl_component/widgets/index';
//import ElementModelProcess from '../../dsl_models/elements/index';

// 组件匹配主要作用是根据制定好的模型及模板
// 简化栅格化后的布局及语义化处理
// 这里分为组件模型和元素模型的优化匹配,
//
export default function(tree: any) {
  // 匹配处理
  WidgetModelProcess(tree);
}
