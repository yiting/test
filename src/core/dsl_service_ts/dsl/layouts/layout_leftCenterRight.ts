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
class LayoutLeftCenterRight extends Model.LayoutModel {
  /**
   * 对传进来的模型数组进行处理
   * @param {TreeNode} parent 树节点
   * @param {Array} nodes 树节点数组
   * @param {Array} models 对应的模型数组
   * @param {Int} layoutType 布局的类型
   */
  handle(parent: any, nodes: any) {
    const that: any = this;
  }
}

export default new LayoutLeftCenterRight();
