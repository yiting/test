// 循环结构的逻辑处理模块
import Common from '../common';
import Utils from '../utils';
import Model from '../model';
import Group from '../group';
import Constraints from '../constraints';
import Similar from './layout_similar';
import { debug } from 'util';
import Store from '../../helper/store';

let ErrorCoefficient: number = 0;
let OptimizeWidth: number = 0;
class LayoutAround extends Model.LayoutModel {
  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   */
  handle(parent: any, nodes: any) {
    const that: any = this;
    const flexNodes = nodes.filter((nd: any) => {
      return (
        nd.constraints.LayoutSelfPosition !==
        Constraints.LayoutSelfPosition.Absolute
      );
    });
    if (flexNodes.length > 3) {
      return;
    }
    // 如果子节点不水平，则返回
    if (!Utils.isHorizontal(flexNodes)) {
      return;
    }
    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    OptimizeWidth = Store.get('optimizeWidth') || 0;

    LayoutAround.is(flexNodes, parent);
  }

  static is(nodes: any[], parent: any) {
    const centerNode: any = nodes.find((nd: any) => {
      return Math.abs(nd.abX + nd.abXops - OptimizeWidth) < ErrorCoefficient;
    });
    const centerIndex = nodes.indexOf(centerNode);
    const prev: any = nodes[centerIndex - 1];
    const next: any = nodes[centerIndex + 1];
    let fixed = false;
    if (prev && next) {
      fixed =
        prev.abX > 0 &&
        next.abXops < OptimizeWidth &&
        prev.abX - (OptimizeWidth - next.abXops) <= ErrorCoefficient;
    } else if (prev) {
      fixed = prev.abX > 0 && prev.abX / OptimizeWidth < 0.1;
    } else if (next) {
      fixed = next.abXops < OptimizeWidth && next.abXops / OptimizeWidth > 0.9;
    }

    if (fixed) {
      // centerNode
      parent.constraints.LayoutPosition = Constraints.LayoutPosition.Absolute;
      parent.constraints.LayoutJustifyContent =
        Constraints.LayoutJustifyContent.Center;
      if (prev) {
        // prev
        prev.constraints.LayoutSelfPosition =
          Constraints.LayoutSelfPosition.Absolute;
        prev.constraints.LayoutSelfHorizontal =
          Constraints.LayoutSelfHorizontal.Left;
      }
      if (next) {
        // next
        next.constraints.LayoutSelfPosition =
          Constraints.LayoutSelfPosition.Absolute;
        next.constraints.LayoutSelfHorizontal =
          Constraints.LayoutSelfHorizontal.Right;
      }
    }
  }
}

export default new LayoutAround();
