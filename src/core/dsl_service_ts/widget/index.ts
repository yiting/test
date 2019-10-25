import WidgetList from './widgetList';
const walkout = (node: any, handler: Function) => {
  if (!node.children || !node.children.length) return;
  const children = [...node.children];
  children.forEach(n => {
    walkout(n, handler);
    handler(n); // 处理节点
  });
  if (!node.parent) handler(node); // 处理根节点
};
export default function(nodeTree: any) {
  walkout(nodeTree, (tree: any) => {
    let children = tree.children;
    if (!children) {
      return;
    }
    WidgetList.some((widget: any) => {
      let matchGroup = widget.capture(children);
      matchGroup.forEach((matchNodes: any[]) => {
        let newChild = new widget();
        newChild.appendChild(...matchNodes);
        newChild.resize();
        newChild.resetZIndex();
        children = children.filter((child: any) => !matchNodes.includes(child));
        children.push(newChild);
      });
      return matchGroup.length > 0;
    });
    tree.children = children;
  });
}
