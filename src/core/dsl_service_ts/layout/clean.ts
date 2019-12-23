import Utils from '../helper/methods';

export default (dslTree: any) => {
  return clean(dslTree);
};
function clean(node: any) {
  if (node.children) {
    node.children.forEach(clean);
  }
  return merge(node);
}
function merge(node: any) {
  if (node.children) {
    let children = Utils.filterAbsNode(node.children);
    let child = children[0];
    if (
      children.length == 1 &&
      child.abY == node.abY &&
      child.abYops == node.abYops &&
      child.abX == node.abX &&
      child.abXops == node.abXops
    ) {
      console.log(child.id);
      return replace(node, child);
    }
  }
  return node;
}
function replace(parent: any, child: any) {
  let otherNodes = parent.children.filter((c: any) => c !== child);
  otherNodes.forEach((c: any) => (c.parent = child));
  child.children.push(...otherNodes);
  child.parent = parent.parent;
  if (parent.parent) {
    let parentIndex = parent.parent.children.indexOf(parent);
    parent.parent.children.splice(parentIndex, 1, child);
  }
  return child;
}
