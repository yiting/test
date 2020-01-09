// 组件模型的匹配入口
//
import WidgetModelProcess from './widgets/index';

// 组件匹配主要根据制定好的模型及模板
// 简化栅格化后的布局及语义化处理
// 这里分为组件模型及元素模型的匹配
export default function(tree: any) {
  // 匹配处理
  WidgetModelProcess(tree);
}
