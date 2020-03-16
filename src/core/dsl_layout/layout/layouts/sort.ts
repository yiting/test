import Utils from '../../../dsl_helper/methods';

export default function(parent: any, nodes: any, models: any) {
  if (Utils.isHorizontal(nodes)) {
    parent.children = _sort(nodes, 'abX');
  } else {
    parent.children = _sort(nodes, 'abY');
  }
}

// 筛选前排序
function _sort(nodes: any, opt: any) {
  return nodes.sort((a: any, b: any) => a[opt] - b[opt]);
}
