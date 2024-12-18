import Util from '../../dsl_helper/methods';
import Store from '../../dsl_helper/store';
import Layer from '../../dsl_model/models/layer';
import * as Constraints from '../../dsl_helper/constraints';

export default function(nodes: any) {
  let groups = Store.get('groups') || [];
  let map: any = {};
  nodes.forEach((n: any) => {
    map[n.id] = n;
  });
  groups.forEach((interfareInfo: any) => {
    let { ids: _allowed_descendantIds, type } = interfareInfo;
    let ns: any = [];
    _allowed_descendantIds.forEach((n: any) => {
      if (map[n]) {
        ns.push(map[n]);
      }
    });
    if (ns.length == 0) {
      return;
    }
    let { abX, abXops, abY, abYops, zIndex } = Util.calRange(ns);
    let layer = new Layer({
      abX,
      abXops,
      abY,
      abYops,
      zIndex,
      _allowed_descendantIds,
    });
    if (type == 'absolute') {
      layer.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
    }
    nodes.push(layer);
  });
  return nodes;
}
