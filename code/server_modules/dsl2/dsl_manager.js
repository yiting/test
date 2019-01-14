// 此模块用于模型的使用和管理
//
const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');
const Model =  require('./dsl_model.js');
const ElementList = require('./elements/modellist.js');
const WidgetList = require('./widgets/modellist.js');
const Group = require('./dsl_group.js');
const Layout = require('./dsl_layout.js');

// 按优先级排序匹配模型
let sortElementList = Utils.sortModelList(ElementList);
let sortWidgetList = Utils.sortModelList(WidgetList);

/**
 * 进行节点匹配的核心流程
 * 传入节点匹配出各模型
 * @param nodes 需要匹配的节点
 * @param matchType 匹配模型的类型
 * @param {Int} endY 匹配的范围界线
 */
let matchModel = function(nodes, matchType, endY) {
    // 匹配的逻辑是按组件模型优先级排序,遍历组件模型数组,
    // 再按组件模型所需的元素个数通过Utils.getGroupFromNodes
    // 进行随机取出，最后交由组件模型进行匹配
    // 匹配完毕后要对元素进行去重处理
    let result = [];
    let modelList;

    switch(matchType) {
        case Common.MatchingElements:
            modelList = sortElementList;
            break;
        case Common.MatchingWidgets:
            modelList = sortWidgetList;
            break;
        default:;
    }

    // 随机匹配节点类型算法函数
    modelList.forEach(matchModel => {
        let groups = Utils.getGroupFromNodes(nodes, 
                                            matchModel.getTextNumber(), 
                                            matchModel.getIconNumber(), 
                                            matchModel.getImageNumber(),
                                            matchModel.getShapeNumber());

        //console.log(groups);
        if (groups && groups.length > 0) {
            for (let i = 0; i < groups.length; i++) {
                let isMatched = false;
                let group = groups[i];
                // 这里要做一个处理，匹配完的节点就不再进行匹配
                // 以防同一节点匹配到多个组件模型，因为组件模型已有优先级
                // 所以节点等于有了优先匹配选择
                for (let j = 0; j < group.length; j++) {
                    let node = group[j];

                    if (node.isMatched) {
                        isMatched = true;
                        break;
                    }
                }

                if (isMatched) {
                    continue;
                }

                let bool = matchModel.isMatch(group);
                
                if (bool) {
                    // 生成匹配数据
                    let mData = new Model.MatchData(matchModel);
                    if (matchType == Common.MatchingWidgets && mData.abY <= endY && mData.abYops > endY) {
                        // 如果匹配的模型范围落在下边界里, 则模型留范围往下移动后匹配
                        continue;
                    }

                    result.push(mData);
                    // 每个组件模型匹配完毕从总节点上移除对应的元素
                    Utils.removeMatchedNodes(nodes, group);
                }
            }
        }
    });

    return result;
}

/**
 * 对匹配好的模型做成组处理
 * @param {Array} elementModels 
 * @param {Array} widgetModels 
 * @returns {DslTree} 返回组成的树
 */
let groupModel = function(elementModels, widgetModels) {
    return Group.join(elementModels, widgetModels);
}

/**
 * 对匹配好的组件/元素模型之间进行布局关系的分析处理
 * @param {DslTree} dslTree 需要进行布局关系处理的模型
 * @param {Int} layoutType 处理布局的方式
 */
let layoutModel = function(dslTree, layoutType) {
    Layout.layout(dslTree, layoutType);
}

// /**
//  * 对匹配好的组件/元素模型之间进行布局关系的分析处理
//  * @param {DslTree} dslTree 需要进行布局关系处理的模型
//  * @param {Int} layoutType 处理布局的方式
//  */
// let layoutModel = function(dslTree, layoutType) {
//     // layout逻辑主要分两部分
//     // 1, 约束处理
//     // 2, 循环处理
//     dslTree.setLayoutType(layoutType);
//     _handleContraint(dslTree, dslTree.getData());
//     _handleCircle(dslTree, dslTree.getData());
// }

// /**
//  * 对dslTree进行约束分析处理
//  * @param {DslTree} dslTree DslTree
//  * @param {TreeNode} parent DslTree节点数据树
//  * @param {Int} layoutType 布局方式
//  */
// let _handleContraint = function(dslTree, parent, layoutType) {
//     // 约束的处理只需从外到内递归, 让布局模型处理
//     let children = parent.children;

//     if (children.length <= 0) {
//         return;
//     }

//     let models = [];
//     children.forEach(child => {
//         let md = dslTree.getModelData(child.id);
//         models.push(md);
//     });
    
//     // 布局模型处理
//     LayoutList.forEach(model => {
//         model.handle(parent, children, models, layoutType);
//     });

//     children.forEach(child => {
//         _handleContraint(dslTree, child, layoutType);
//     });
// }

// /**
//  * 对dslTree进行约束分析处理
//  * @param {DslTree} dslTree DslTree
//  * @param {TreeNode} parent DslTree节点数据树
//  */
// let _handleCircle = function(dslTree) {

// } 


module.exports = {
    matchModel,
    groupModel,
    layoutModel
}