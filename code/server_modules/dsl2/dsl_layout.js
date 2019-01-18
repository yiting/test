// 模块用于对模型进行布局及结构分析, 生成可用于渲染的数据
const LayoutList = require('./layouts/modellist.js');
const LayoutSimilar = require('./layouts/layout_similar.js');
const LayoutCircle = require('./layouts/layout_circle.js');
const LayoutSort = require('./layouts/layout_sort.js');

let layout = function (dslTree, layoutType) {
    // layout逻辑主要分两部分
    // 1, 循环处理
    // 2, 约束处理
    dslTree.setLayoutType(layoutType);
    // 布局
    _handleLayout(dslTree, dslTree._treeData, layoutType);
    // 相似
    _handleSimilar(dslTree._treeData, layoutType);
    // 循环
    _handleCircle(dslTree._treeData, layoutType);
    // 排序
    _handleSort(dslTree, dslTree._treeData, layoutType);
}
/**
 * 对dslTree进行约束分析处理
 * @param {DslTree} dslTree DslTree
 * @param {TreeNode} parent DslTree节点数据树
 * @param {Int} layoutType 布局方式
 */
let _handleLayout = function (dslTree, parent, layoutType) {
    // 约束的处理只需从外到内递归, 让布局模型处理
    let children = parent.children;

    if (children.length <= 0) {
        return;
    }

    let models = [];
    children.forEach(child => {
        let md = dslTree.getModelData(child.id);
        models.push(md);
    });

    // 布局模型处理
    LayoutList.forEach(model => {
        model.handle(parent, children, models, layoutType);
    });

    children.forEach(child => {
        _handleLayout(dslTree, child, layoutType);
    });
}

/**
 * 对dslTree进行结构循环分析
 * @param {TreeNode} parent DslTree节点数据树
 * @param {Int} layoutType 布局方式
 */
let _handleCircle = function (parent, layoutType) {
    let children = parent._children;
    if (children.length <= 0) {
        return;
    }
    LayoutCircle.handle(parent, children, layoutType);

    children.forEach(child => {
        _handleCircle(child, layoutType);
    });
}
/**
 * 对dslTree进行结构循环分析
 * @param {TreeNode} parent DslTree节点数据树
 * @param {Int} layoutType 布局方式
 */
let _handleSimilar = function (parent, layoutType) {
    LayoutSimilar.handle(parent, layoutType);
}


/**
 * 对dslTree进行结构循环分析
 * @param {DslTree} dslTree DslTree
 * @param {TreeNode} parent DslTree节点数据树
 * @param {Int} layoutType 布局方式
 */
let _handleSort = function (dslTree, parent, layoutType) {
    let children = parent._children;

    if (children.length <= 0) {
        return;
    }

    LayoutSort.handle(parent, children, layoutType);

    children.forEach(child => {
        _handleSort(dslTree, child, layoutType);
    });
}

module.exports = {
    layout
}