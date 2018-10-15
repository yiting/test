
// 往外走
function walkout(node,handler) {
    if (!node.children || !node.children.length) return;

    node.children.map(node => {
        walkout(node,handler);
        handler(node); // 处理节点
    });
    if(!node.parent) handler(node); // 处理根节点
}
// 往里走
function walkin(node,handler) {
    if (!node.children || !node.children.length) return;
    if(!node.parent) handler(node); // 处理根节点

    node.children.map(node => {
        handler(node); // 处理节点
        walkin(node,handler);
    })
}
function hasMaskChild(node) {
    if(!node || !node.children || !node.children.length) return false;
    return node.children.some(node => node.type === 'QMask');
}
// 平铺节点为一维数组
function serialize(tree) {
    const arr = [];
    walkin(tree,node => arr.push(node));
    return arr;
}
// 是否重合
function isCoincide(node,pnode) {
    return node.width === pnode.width && node.height === pnode.height && node.abX === pnode.abX && node.abY === pnode.abY
}
// 元素合并样式属性
function mergeStyle(targetNode,node) {
    // TODO
    for(key in node.styles) {
        if (!targetNode.styles[key]) targetNode.styles[key] = node.styles[key];
    }
}
function hasCompleteSytle(node) { // 节点是否包含影响子元素的属
    // TODO 性：opacity,transform
    if (!node.styles) return false;
    const {opacity,rotation,border,borderRadius,shadows,background} = node.styles;
    const isBgComplex = background && !(background.type === 'color' && background.color.a === 1)
    return opacity != 1 || rotation!= 0 || border || shadows || borderRadius!=0 || isBgComplex ;
}
function generateGroupAttr(nodes) {
     // 如果是mask，则合并的图片为mask的位置大小信息
    const maskList = nodes.filter(({type}) => type === 'QMask');
    if(maskList.length) {
        const {x,y,abX,abY,width,height} = maskList[0];
        return { x,y,abX,abY,width,height };
    }
    // 通过子元素计算合成图片的位置大小信息
    const x = Math.min(...nodes.map(({x}) => x));
    const y = Math.min(...nodes.map(({y}) => y));
    const abX = Math.min(...nodes.map(({abX}) => abX));
    const abY = Math.min(...nodes.map(({abY}) => abY));
    const abX1 = Math.max(...nodes.map(({abX,width}) => abX + width));
    const abY1 = Math.max(...nodes.map(({abY,height}) => abY + height));
    return {
        abX,
        abY,
        x,
        y,
        width: abX1 - abX,
        height: abY1 - abY
    }
}
module.exports = {
    walkout,
    walkin,
    hasMaskChild,
    serialize,
    isCoincide,
    mergeStyle,
    hasCompleteSytle,
    generateGroupAttr
}