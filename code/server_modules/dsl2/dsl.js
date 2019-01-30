// dsl模块
// 
// dsl的核心思路:
// 所有网页设计由基础元素: 文字(QText), 较大图片(QImage), 120*120以下图片(QIcon), 可样式描述层(QShape)组成
// 基础元素的互相组合形成了页面设计的组件, 但由于设计稿层级和结构的不可靠性, 导致节点的不可靠性, 但网页
// 设计的组件的确由这些组件所组成, 也就是说这些节点的确能组成我们所需的组件。所以可以排列尽这些节点所能
// 形成的组合, 然后根据组件模型去判断那个组合是合理的, 然后将这些组合全部找出来, 最后对这些组合进行排版及循环处理
const Common = require('./dsl_common.js');
const Utils = require('./dsl_utils.js');
const Manager = require('./dsl_manager.js');

/**
 * dsl模块的使用接口
 * @param {Array} nodes 要匹配的所有节点
 * @param {Int} optimizeWidth 匹配的
 * @param {Int} optimizeHeight
 * @param {Int} layoutType dsl的布局方式  
 */
let process = function(nodes, optimizeWidth, optimizeHeight, layoutType) {
    if (!nodes || !nodes.length || nodes.length == 0) {
        return;
    }

    let maxNodeX = 0;                   // 用于将空间分割的辅助参数
    let maxNodeY = 0;                   // 用于将空间分割的辅助参数
    let matchingNodes = [];             // 需要进行匹配的节点
    let matchedElements = [];           // 匹配完毕的元素模型
    let matchedWidgets = [];            // 匹配完毕的组件模型
    let dslTree = null;                 // 最后生成的dsl数据结构树
    optimizeWidth = optimizeWidth * 2;  // 这里*2是增加获取数据的范围, 防止超出设计稿外的元素没被匹配
    //optimizeHeight = optimizeHeight * 2;// 有些没识别出的其实是刚好落在识别的边界(这里要想个方法解决)

    // 给匹配的节点做分类成四个基本节点类型,(QText, QIcon, QImage, QShape)
    nodes.forEach((item, index) => {
        maxNodeX = maxNodeX > item.abX? maxNodeX : item.abX;
        maxNodeY = maxNodeY > item.abY? maxNodeY : item.abY;
        item.zIndex = item.zIndex > 0? item.zIndex: index;      // 默认zIndex的值, 越大显示层级越高

        switch(item.type) {
            case 'QLayer':
                // 这里看是否有hasStyle标识, 有则是QShape
                if (item.hasStyle) {
                    item.type = Common.QShape;
                    matchingNodes.push(item);
                }
                break;
            case 'QImage':
                if (item.width <= Common.IconSize && item.height <= Common.IconSize) {
                    item.type = Common.QIcon;
                }
                else {
                    item.type = Common.QImage;
                }    
                matchingNodes.push(item);
                break;
            case 'QText':
                item.type = Common.QText;
                matchingNodes.push(item);
                break;
            default:;
        }
    });
    
    // 匹配元素模型
    _matchModels(10000, matchedElements, matchingNodes, Common.MatchingElements, optimizeWidth, optimizeHeight, maxNodeX, maxNodeY);
    // 匹配组件模型
    _matchModels(10000, matchedWidgets, matchedElements, Common.MatchingWidgets, optimizeWidth, optimizeHeight, maxNodeX, maxNodeY);
    // 生成dsl树
    dslTree = _groupModels(matchedWidgets, matchedElements);
    // 进行布局及循环处理
    _layoutModels(dslTree, layoutType);
    return dslTree;
}

/**
 * 函数用于匹配元素模型或组件模型
 * @param {Int} matchTimes 运行的次数, 防止计算超时间 100000
 * @param {Array} matchedNodes 匹配好的模型存放数组
 * @param {Array} nodes 需要进行匹配的数组
 * @param {Int} mType 匹配的类型, 元素匹配或组件匹配
 * @param {Int} optimizeWidth 用于优化的范围宽
 * @param {Int} optimizeHeight 用于优化的范围长
 * @param {Int} maxX 节点所组成的最长宽度, 用于降低节点匹配计算量 
 * @param {Int} maxY 节点所组成的最长高度, 用于降低节点匹配计算量 
 */
let _matchModels = function(matchTimes, matchedNodes, nodes, mType, optimizeWidth, optimizeHeight, maxX, maxY) {
    if (!nodes || !nodes.length || nodes.length == 0 || matchTimes <= 0) {
        return;
    }
    // console.log('_matchModels begin, 处理节点长度为: ' + nodes.length + ' ----------------------------------');
    let beginX = 0;
    let beginY = 0;
    let nowTimes = 0;
    while(nowTimes < matchTimes) {
        nowTimes++;
        if (nowTimes >= matchTimes) {
            console.log('重要: 节点匹配计算量超过matchTimes上限!');
        }

        // 需要匹配的节点
        let mNodes = Utils.getNodesFromSize(nodes, beginX, beginY, optimizeWidth, optimizeHeight);
        // console.log('Utils.getNodesFromSize 得到需要处理的节点长度为: ' + mNodes.length);
        // 通过模型匹配出各组件
        let result;
        if (mNodes && mNodes.length > 0) {
            result = Manager.matchModel(mNodes, mType, (beginY + optimizeHeight));
        }

        if (result && result.length > 0) {
            result.forEach(item => {
                matchedNodes.push(item);
            });
        }

        // 匹配完删除对应的节点
        Utils.removeMatchedDatas(nodes, result);
        // 每次匹配完后将范围缩减
        // 这里暂时只进行y范围的处理
        beginY += parseInt(optimizeHeight / 2);
        if (beginY >= maxY) {
            // 已经没节点进行匹配
            return;
        }
    }
}

/**
 * 对匹配好的模型做成组处理...
 * @param {Array} widgets 已匹配的组件模型
 * @param {Array} elements 已匹配的元素模型
 * @returns {DslTree}
 */
let _groupModels = function(widgets, elements) {
    let tree = Manager.groupModel(widgets, elements);
    return tree;
}

/**
 * 对DSL树对象进行布局及循环处理
 * @param {DslTree} dslTree DslTree对象
 * @param {Int} layoutType 布局的方式 
 */
let _layoutModels = function(dslTree, layoutType) {
    Manager.layoutModel(dslTree, layoutType);
}


// 对外接口
module.exports = {
    process
}