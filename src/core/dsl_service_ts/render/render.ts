// render模块
//
// render模块用于将dslTree的数据和Template结合并返回可操作的render类作为数据输出
// render的处理主要分两步
// 1, 将dslTree的数据和模板接合,
// 2, 将结合后的json数据输出, 主要是约束的解析计算

import fs from 'fs';

import Utils from './utils';
import Constraints from '../helper/constraints';
// import Builder from './builder';
import H5Builder from './h5/builder';
import TemplateList from '../template/html/templatelist';
import Template from '../template/template';
import TemplateData from '../template/templateData';
import QLog from '../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);
/**
 *
 * @param {*} dslTree
 */
function con(data: any) {
  if (data.children) {
    data.children.forEach((nd: any) => con(nd));
  }
}

function _similarLogic(a: any, b: any, _nodeCache: any) {
  const aS = _nodeCache[a.similarParentId];
  const bS = _nodeCache[b.similarParentId];
  const aX = a.abX - aS.abX;
  const aY = a.abY - aS.abY;
  const bX = b.abX - bS.abX;
  const bY = b.abY - bS.abY;
  const aXops = a.abXops - aS.abX;
  const aYops = a.abYops - aS.abY;
  const bXops = b.abXops - bS.abX;
  const bYops = b.abYops - bS.abY;
  const aCX = (aX + aXops) / 2;
  const aCY = (aY + aYops) / 2;
  const bCX = (bX + bXops) / 2;
  const bCY = (bY + bYops) / 2;
  const errorCoefficient = 3;
  // 不同源，且位置相同的节点
  return (
    a.similarParentId !== b.similarParentId &&
    ((Math.abs(aX - bX) < errorCoefficient &&
      Math.abs(aY - bY) < errorCoefficient &&
      Math.abs(aXops - bXops) < errorCoefficient &&
      Math.abs(aYops - bYops) < errorCoefficient) ||
      (Math.abs(aCX - bCX) < errorCoefficient &&
        Math.abs(aCY - bCY) < errorCoefficient))
  );
}
class Render {
  _similarIndex: number;

  _similarMap: any;

  _nodeCache: any;

  _data: any;

  _builder: any;

  constructor(data: any, Builder: any, layoutType: any) {
    if (!data) {
      return;
    }
    // con(data);
    this._similarIndex = 0;
    this._similarMap = {};
    // 键值对形式缓存节点
    this._nodeCache = {};
    this._data = data;
    // 遍历所有相似节点
    Loger.debug('render.js [setSimilar]');
    this._setSimilar(this._data);

    Loger.debug('render.js [setSimilarChild]');
    this._setSimilarChild();

    Loger.debug('render.js [new builder]');
    this._builder = new Builder(this._data, layoutType);
  }

  /**
   * 遍历节点，找到相似节点
   * @param {*} data
   */
  _setSimilar(data: any) {
    try {
      this._nodeCache[data.id] = data;
      if (data.similarId) {
        const { similarId } = data;
        if (!this._similarMap[similarId]) {
          this._similarMap[similarId] = [];
        }
        this._similarMap[similarId].push(data);
      }
      data.children.forEach((nd: any) => this._setSimilar(nd));
    } catch (e) {
      Loger.error(`render.js [setSimilar]:${e}, params[data.id:${data.id}]`);
    }
  }

  /**
   * 设置循环节点的子节点比对
   */
  _setSimilarChild() {
    try {
      Object.keys(this._similarMap).forEach(similarId => {
        const that: any = this;
        const group = that._similarMap[similarId];
        this._compareSimilar(group, similarId);
      });
    } catch (e) {
      Loger.error(`render.js [setSimilarChild]:${e}`);
    }
  }

  /**
   * 对比子节点是否相似
   * @param {Array} nodes
   */
  _compareSimilar(nodes: any[], _similarSourceId: string) {
    try {
      // 获取需要比对相似的节点
      const compareNodes: any[] = [];
      nodes.forEach((node: any) => {
        compareNodes.push(
          ...node.children.filter((_nd: any) => {
            const nd: any = _nd;
            // 剔除绝对定位和已经是相似的节点
            if (
              nd.constraints.LayoutSelfPosition !==
                Constraints.LayoutSelfPosition.Absolute &&
              nd.similarId === null
            ) {
              nd.similarParentId = nd.similarParentId || node.id;
              return true;
            }
            return false;
          }),
        );
      });
      if (compareNodes.length === 0) {
        return;
      }
      // 根据特征分组，同组即应为相同similarId
      const groups = Utils.gatherByLogic(compareNodes, (a, b) => {
        const isSimilar = _similarLogic(a, b, this._nodeCache);
        return isSimilar;
      });
      groups.forEach((_group: any) => {
        const group: any = _group;
        // length为1,即没有相似位置的元素
        const that: any = this;
        const nextCompareNodes: any[] = [];
        if (group.length > 1) {
          const similarId = `_${this._similarIndex}`;
          this._similarIndex += 1;
          that._similarMap[similarId] = group;
          group.forEach((_nd: any) => {
            const nd: any = _nd;
            nd.similarId = similarId;
          });
          this._compareSimilar(nextCompareNodes, _similarSourceId);
        } else {
          // 如果为非相似元素，则取消similarParentId
          group[0].similarParentId = null;
        }
      });
    } catch (e) {
      Loger.error(
        `render.js [_compareSimilar]:${e}, params[_similarSourceId:${_similarSourceId},nodes:${nodes
          .map((n: { id: any }) => n.id)
          .join(',')}]`,
      );
    }
  }

  /* getTpl() {
            return this._builder._getTpl();
        } */

  /**
   * 返回结构字符串
   * @return {String}
   */
  getTagString() {
    let htmlStr = '';
    if (this._builder) {
      htmlStr = this._builder.getTagString();
    }
    return htmlStr;
  }

  /**
   * 返回样式字符串
   * @returns {String}
   */
  getStyleString() {
    let cssStr = '';
    if (this._builder) {
      cssStr = this._builder.getStyleString();
    }
    return cssStr;
  }

  /**
   * 根据路径输出字符串
   * @param {String} path
   * @param {String} string
   */
  static outputFileWithPath(path: string, string: string) {
    try {
      fs.writeFile(path, string, err => {
        if (err) {
          Loger.info(err);
        } else {
          Loger.info(`${path}生成成功`);
        }
      });
    } catch (e) {
      Loger.error(
        `render.js [outputFileWithPath]:${e}, params[path:${path},string:${string}]`,
      );
    }
  }

  /**
   * 方法
   * @param {DslTree} dslTree
   * @param {string} layoutType
   */
  static pipe(dslTree: any, config: any) {
    Loger.debug('render.js [pipe]');
    // 默认直接使用h5模板引擎输出
    TemplateData.reset();
    const renderJSON = dslTree.getRenderData().toJSON();
    let render: any;
    let templateData: any;
    // con(renderJSON)
    try {
      // 这里直接使用h5 builder
      Loger.debug('render.js [Template parse]');
      templateData = Template.parse(renderJSON, null, TemplateList);

      Loger.debug('render.js [new Render]');
      render = new Render(templateData, H5Builder, config.layoutType);
    } catch (e) {
      Loger.error(`render.js [pipe] ${e}`);
    }
    return render;
  }
}

export default Render;
