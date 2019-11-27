// 往外走
function walkout(node, handler) {
  if (!node.children || !node.children.length) return;
  const children = [...node.children];
  children.forEach(n => {
    walkout(n, handler);
    handler(n); // 处理节点
  });
  if (!node.parent) handler(node); // 处理根节点
}
// 往里走
function walkin(node, handler) {
  if (!node.children || !node.children.length) return;
  if (!node.parent) handler(node); // 处理根节点
  const children = [...node.children];
  children.forEach(n => {
    handler(n); // 处理节点
    walkin(n, handler);
  });
}
// 平铺节点为一维数组
function serialize(node) {
  const arr = [];
  walkin(node, n => arr.push(n));
  return arr;
}
/**
 * 多节点成组属性
 * @param {Array.<QObject>} nodes
 */
function generateGroupAttr(nodes) {
  // 通过子元素计算合成图片的位置大小信息
  const abX = Math.min(...nodes.map(n => n.abX));
  const abY = Math.min(...nodes.map(n => n.abY));
  const abXops = Math.max(...nodes.map(n => n.abX + n.width));
  const abYops = Math.max(...nodes.map(n => n.abY + n.height));
  return {
    abX,
    abY,
    width: abXops - abX,
    height: abYops - abY,
  };
}
function getBiggestNode(nodes) {
  if (!Array.isArray(nodes) || !nodes.length) return null;
  let maxSize = 0;
  let maxNode = null;
  nodes.forEach(n => {
    if (n.width * n.height > maxSize) {
      maxSize = n.width * n.height;
      maxNode = n;
    }
  });
  return maxNode;
}
// 是否重合
function isCoincide(node, pnode) {
  return (
    node.width === pnode.width &&
    node.height === pnode.height &&
    node.abX === pnode.abX &&
    node.abY === pnode.abY
  );
}
function isBelong(a, b) {
  // 视觉上A是否被B嵌套
  return (
    a.abX >= b.abX &&
    a.abY >= b.abY &&
    a.abXops <= b.abXops &&
    a.abYops <= b.abYops
  );
}
// 是否碰撞
function isCollide(a, b) {
  return !(
    a.abX > b.abXops ||
    a.abY > b.abYops ||
    b.abX > a.abXops ||
    b.abY > a.abYops
  );
}
// 是否相交
function isIntersect(a, b) {
  return !(
    a.abX >= b.abXops ||
    a.abY >= b.abYops ||
    b.abX >= a.abXops ||
    b.abY >= a.abYops
  );
}

// 元素合并样式属性
function mergeStyle(targetNode, node, targetKeys) {
  // TODO
  const keys = targetKeys || Object.keys(node.styles);
  for (const key of keys) {
    if (!targetNode.styles[key] || key === 'background') {
      // eslint-disable-next-line no-param-reassign
      targetNode.styles[key] = node.styles[key];
    }
  }
}

function hasText(node, root) {
  if (node.type !== 'QImage' && node.type !== 'QShape') return false;
  const nodes = serialize(root);
  const index = nodes.findIndex(n => n === node);
  return !!nodes
    .slice(index + 1)
    .filter(n => n.type === 'QText')
    .find(n => isBelong(n, node));
}

function isSameColor(colorA, colorB) {
  if (!colorA || !colorB) return false;
  return Object.values(colorA).join(',') === Object.values(colorB).join(',');
}

function extractDom(rootNode, idList) {
  const tagetNodes = serialize(rootNode)
    .filter(n => ~idList.indexOf(n.id))
    .sort((a, b) => a.zIndex - b.zIndex);
  rootNode.removeAll();
  tagetNodes.forEach(n => {
    rootNode.add(n);
  });
}

module.exports = {
  walkout,
  walkin,
  serialize,
  isCoincide,
  mergeStyle,
  isBelong,
  isCollide,
  isIntersect,
  // hasStyle,
  // hasComplexSytle,
  generateGroupAttr,
  getBiggestNode,
  hasText,
  isSameColor,
  extractDom,
  // isPureColor
};
