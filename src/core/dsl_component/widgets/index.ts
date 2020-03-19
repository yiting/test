// 组件模型的匹配也是通过modellist初始化models实例,排序后进行match匹配
//
import Utils from '../utils';
import WG4M1 from './wg4_m1';
import WG3M1 from './wg3_m1';

// 模型列表
const ModelList = [
    new WG4M1(),
    new WG3M1()
];
// 优先级排序

export default function(tree: any) {
    let matchNodes: any = [];   // 找出所有的节点匹配组
    _findNodes(tree, matchNodes);
    
    // matchNodes进行匹配
    if (matchNodes.length > 0) {
        matchNodes.forEach((nodes: any) => {
            let result: any = _matchModel(nodes);
            //replaceGroups.push(result);
            // 进行节点树的替换
            if (result.length > 0) {
                //console.log(result);
                result.forEach((res: any) => {
                    _replaceTreeNode(tree, res);
                });
            }
        });
    }
}


/**
 * 从节点中抽取用于匹配的节点
 * @param {Object} node 节点树
 */
let _findNodes = function(node: any, mNode: any) {
    // 因为要更改的结构都是图文组合, 用于组合匹配的节点为Image, Inline, Text
    // 而这些节点都是都会有一层layer包括,再组合起来
    // 所以搜索为：找到Image, 然后对Image所在layer的对应的兄弟节点layer的元素进行匹配
    _findImageNode(null, node, mNode);
}

// 获取对应匹配的节点
let _findImageNode = function(parentNode: any, node: any, matchNodes: any) {
    if (!node || node._isSearched) return;
    // 找到QImage对应的layer, 并将对应的其它兄弟节点传进去做匹配处理
    const children = node.children;
    if (children && children.length == 1 && children[0].type == 'QImage') {
        // 设置一个替换标识
        node.id = 'replace' + children[0].id;

        let brotherLayer: any = [];
        if (parentNode) {
            brotherLayer = parentNode.children.filter((obj: any) => {
                return obj != node;
            });
        }
        let res: any = _handleModelMatch(node, brotherLayer);
        matchNodes.push(res);
        // 不再递归
        return;
    }

    if (children && children.length > 0) {
        children.forEach((nd: any) => {
            _findImageNode(node, nd, matchNodes);
        });
    }
}

// 获取需要匹配的节点
let _handleModelMatch = function(imageLayer: any, otherLayer: any): any {
    let matchNodes: any = [];
    // 获取imageLayer及otherLayer的节点
    _findMatchNode(imageLayer, matchNodes);
    
    otherLayer.forEach((otlayer: any) => {
        _findMatchNode(otlayer, matchNodes);
    });

    return matchNodes;
}

// 获取匹配的节点,QImage, QText, Inline,
let _findMatchNode = function(node: any, matchNodes: any) {
    if (!node) return;

    if (node.type == 'QImage' || node.type == 'QText' || node.type == 'Inline') {
        matchNodes.push(node);
        return;
    }

    if (node.children && node.children.length) {
        node.children.forEach((child: any) => {
            _findMatchNode(child, matchNodes);
        });
    }
}

// 节点匹配核心流程
let _matchModel = function(nodes: any[]): any {
    let result: any[] = [];
    if (!nodes || nodes.length <= 1) {  // 剩下一个元素就不匹配了
        return result;
    }

    ModelList.forEach((model: any) => {
        if (!model) return;
        let groups: any[] = [];     // 需要匹配的节点

        groups = Utils.getGroupFromNodes(nodes, model.textNum, model.imageNum);
        // console.log(groups)
        if (groups.length > 0) {
            for (let i = 0; i < groups.length; i++) {
                let isMatched: boolean = false;
                let group: any[] = groups[i];

                // 这里要做一个处理,匹配完的节点就不再进行匹配
                // 以防同一个节点匹配到多个模型，因为模型已有优先级
                // 所以节点等于有了优先匹配选择
                for (let j = 0; j < group.length; j++) {
                    let node: any = group[j];

                    if (node.isMatched) {
                        isMatched = true;
                        break;
                    }
                }

                if (!isMatched) {
                    let bool: boolean = model.isMatch(group);

                    if (bool) {
                        // 直接节点放数组先
                        result.push(group);
                        // 移除匹配后的节点
                        Utils.removeMatchedNodes(nodes, group);
                    }
                }
            }
        }
    });

    return result;
}


// 节点替换流程
let _replaceTreeNode = function(tree: any, replaceNodes: any) {
    if (!tree || !replaceNodes || !replaceNodes.length) return;
    // 临时替换逻辑,
    // 暂时组件都是以图片为基础,找到图片的parent(layer)->parent(root)进行节点的替换
    Utils.sortListByParam(replaceNodes, 'abX');
    let theImage: any = null;
    for (let i = 0; i < replaceNodes.length; i++) {
        let rnode: any = replaceNodes[i];
        if (rnode.type == 'QImage') {
            theImage = rnode;
            break;
        }
    }

    // 指向替换的根节点
    let replaceRootNode: any = theImage.parent.parent;
    // 处理节点的替换
    if (replaceRootNode) {
        _handleReplace(tree, replaceRootNode, replaceNodes);
    }
}

// 节点的替换逻辑
let _handleReplace = function(tree: any, rRoot: any, rNodes: any) {
    // 找出对应的替换id
    if (tree.id == rRoot.id) {
        // 进行替换工作
        // 先粗暴测试替换完所有节点
        tree.children = [];
        tree.children = rNodes;
        return;
    }

    if (tree.children && tree.children.length) {
        tree.children.forEach((child: any) => {
            _handleReplace(child, rRoot, rNodes);
        });
    }
}
