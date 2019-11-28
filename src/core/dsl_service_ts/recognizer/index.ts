// import QLog from '../log/qlog';
import ElementProcess from '../../dsl_models/elements/index';
//import WidgetProcess from '../../dsl_models/widgets/index';

// 设计形态识别接口
// 主要完成组件及循环结构的识别
export default function(nodes: any[]): any {
    // 获取辅助区域接口
  
    // 元素模型的匹配
    let opt = {};
    let eles: any[] = ElementProcess(nodes, opt);
    // 组件模型的匹配
    
}





