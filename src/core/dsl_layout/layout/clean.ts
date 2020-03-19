import Utils from '../../dsl_helper/methods';
import Dictionary from '../../dsl_helper/dictionary';

export default (dslTree: any) => {
  if (dslTree.children) {
    let children = Utils.filterAbsNode(dslTree.children);
    let child = children[0];
    if (
      child &&
      // child.type != Dictionary.type.QText &&
      children.length == 1 &&
      child.abY == dslTree.abY &&
      child.abYops == dslTree.abYops &&
      child.abX == dslTree.abX &&
      child.abXops == dslTree.abXops
    ) {
      return replace(dslTree, child);
    }
  }
  return dslTree;
};
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
