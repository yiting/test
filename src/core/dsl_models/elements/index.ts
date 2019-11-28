//import QLog from '../log/qlog';
import ModelUtils from '../utils';


// 元素模型的处理暂时这里处理两类型
// 1, 单行所有元素组成一组
// 2, tag结构元素
/**
 * 元素模型匹配出一行或tag类型的结构
 * @param {Array} nodes 匹配的元素 
 * @param {Object} options 
 */
export default function(nodes: any[], options: any) {
    let res: any = [];
    let opt: any = {};
    // 单行元素    
    ModelUtils.getInlineNodes(nodes);






    return res;
}

