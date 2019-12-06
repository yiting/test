// 组件模型的匹配也是通过modellist初始化models实例,排序后进行match匹配
//
import WG4M1 from './wg4_m1';
import handle from 'src/core/dsl_service_ts/render/helper/textRevise';

// 模型列表
const ModelList = [
    new WG4M1(),
];
// 优先级排序

export default function(node: any) {
    // let md = ModelList[0];
    // md.isMatch(node);
}


/**
 * 从节点中抽取用于匹配的节点
 * @param {Object} node 节点树
 */
let _findMatchNodes = function(node: any) {
    // 因为要更改的结构都是图文组合, 用于组合匹配的节点为Image, Inline, Text
    // 而这些节点都是都会有一层layer包括,再组合起来
    // 所以搜索算法为：找到Image, 然后对Image所在layer的对应的兄弟节点layer的元素进行匹配
    //
    
}


let _findImageNode = function(node: any) {
    if (!node || node._isSearched) return;

    if (node.type == 'QImage') {
        _handleImageNode(node);
    }

    if (node.children) {
        
    }
}

let _handleImageNode = function(imageNode: any) {

}

