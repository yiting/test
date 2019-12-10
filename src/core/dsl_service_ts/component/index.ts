import WidgetModelProcess from '../../dsl_models/widgets/index';
//import ElementModelProcess from '../../dsl_models/elements/index';

// 组件匹配主要作用是根据制定好的模型及模板
// 简化栅格化后的布局及语义化处理
// 这里分为组件模型和元素模型的优化匹配,
// 
export default function(tree: any) {
  // 流程处理为自上而下递归处理tree, 组件模型匹配完毕则匹配元素模型
  walkin(tree, (node: any) => {
    WidgetModelProcess(node);
    // 
    // let widgetNodes: any = WidgetModelProcess(node);
    // if (widgetNodes) {
    //   // 
      
      
    //   return false;   // 不需再递归进行组件适配
    // }
    //console.log(node);
    console.log('~~~~~~~~ 递归二轮 ~~~~~~~~~~');
    
  })
}


let walkin = function(node: any, handler: Function) {
  if (!node || !handler) return;

  let canStepIn = handler(node);
  const children = node.children;
  if (canStepIn && children && children.length) {
    children.forEach((nd: any) => {
      walkin(nd, handler);
    });
  }
}

