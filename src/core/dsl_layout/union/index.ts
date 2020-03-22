const walkout = (node: any, handler: Function) => {
  if (!node.children || !node.children.length) return;
  const children = [...node.children];
  children.forEach(n => {
    walkout(n, handler);
    handler(n); // 处理节点
  });
  if (!node.parent) handler(node); // 处理根节点
};
export default function(nodeTree: any, unionList: any = []) {
  walkout(nodeTree, (tree: any) => {
    let children = tree.children;
    if (!children) {
      return;
    }
    unionList.forEach((union: any) => {
      let matchGroup = union.capture(children);
      matchGroup.forEach((matchNodes: any[]) => {
        let newChild = new union(matchNodes);
        newChild.resetZIndex();
        children = children.filter((child: any) => !matchNodes.includes(child));
        children.push(newChild);
      });
    });
    tree.children = children;
  });
}
