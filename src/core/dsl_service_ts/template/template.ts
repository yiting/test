// 假设模板
/* const __tpl = `./html/templatelist
<div class="${this.className}">
    <span $ref="0" :style="{backgroundImage:"url("+path+")"}"></span>
    // $ref="绑定引用"
    // :src="绑定节点变量"
    <img $ref="1" :src="$ref[1].src"/>
    <div>
        <span $each> </span>
    </div>
</div>
` */

// import { Logger } from 'log4js';
import TemplateData from './templateData';
import XmlEngine from './XmlEngine';

import QLog from '../log/qlog';

const _SYMBOL = {
  ref: '$ref',
  each: '$each',
  useTag: '$useTag',
  method: '@',
  var: ':',
  attr: '',
};
const Loger = QLog.getInstance(QLog.moduleData.render);

class Template {
  $ref: any;

  _renderData: any;

  _engine: any;

  _structure: any;

  _parentTpl: any;

  _templateList: any[];

  _rootData: any;

  _template: string;

  _methods: any;

  _name: string;

  constructor(args: any) {
    const _renderDataIndex = 0;
    const _parentTplIndex = 1;
    const _templateListIndex = 2;
    this._renderData = args[_renderDataIndex];
    this._parentTpl = args[_parentTplIndex];
    this._templateList = args[_templateListIndex];
    this._name = 'layer';
    // 节点引用
    this.$ref = this._renderData.nodes || {};
    // 解析引擎
    this._engine = XmlEngine;
  }

  parse() {
    try {
      // 模板内容结构
      this._structure = this._engine.parse(this.template);
      /**
       * 主流程
       * */
      // 遍历模板树
      const d: any = this._traversal(this._structure, this._parentTpl, true);
      const rootIndex = 0;
      this._rootData = d[rootIndex];
    } catch (e) {
      Loger.error(`template.js [parse]:${e}`);
    }
    return this;
  }

  getData() {
    return this._rootData;
  }

  get name() {
    return this._name;
  }

  get template() {
    return this._template;
  }

  // 遍历模板树结构
  _traversal(structure: any, parentTpl: any, isRoot: any) {
    const arr = [];
    for (let index = 0; index < structure.length; index++) {
      const nd = structure[index];
      // 预处理
      const res = this._preProp(nd, structure);
      // 如果为false，则预处理提出中止当前节点编译
      if (res !== false) {
        // 构建数据对象
        const tplData = this._parseObj(nd, parentTpl, isRoot);
        // 赋值
        this._parseProp(tplData, nd);
        // 遍历子节点

        this._traversal(nd.children, tplData, false);
        // 如果为模板虚拟节点，则自动构建坐标
        if (!tplData.type) {
          tplData.resize();
          tplData.modelName = null;
        }
        arr.push(tplData);
      }
    }
    if (parentTpl) {
      parentTpl.children.push(...arr);
    }
    return arr;
  }

  // 属性预处理
  _preProp(_nd: any, structure: any): any {
    const nd = _nd;

    if (Object.keys(nd.attrs).includes(_SYMBOL.each)) {
      // 删除模板节点上的循环标记，避免无限循环
      delete nd.attrs[_SYMBOL.each];
      // 根据循环节点数，构建对应模板节点

      Object.keys(this._renderData.nodes || {}).forEach((index: any) => {
        const newAttr = Object.assign({}, nd.attrs);
        const newNd = Object.assign({}, nd);
        newNd.attrs = newAttr;
        newNd.attrs.$ref = index;
        structure.push(newNd);
      });
      return false;
    }
    return true;
  }

  // 根据模板节点，构建数据节点
  /**
   *
   * @param _nd 模板节点
   * @param parentTpl 父模板
   * @param isRoot 是否跟节点
   */
  _parseObj(_nd: any, parentTpl: any, isRoot: any) {
    const nd = _nd;
    const refIndex = nd.attrs[_SYMBOL.ref];
    let renderData;
    // 删除「引用」字段
    delete nd.attrs[_SYMBOL.ref];
    // 如果模型根节点为引用，则把引用节点信息覆盖根节点
    if (isRoot && this.$ref[refIndex]) {
      this._renderData.id = this.$ref[refIndex].id;
    }
    // 根据条件获取引用对象
    // 如果有引用，则用引用数据
    if (this.$ref && this.$ref[refIndex]) {
      renderData = this.$ref[refIndex];
    } else if (isRoot) {
      // 如果无引用且为模型根节点，则用模型数据
      renderData = this._renderData;
    } else {
      // 没有引用，且不是跟节点
    }
    // 构建模板节点
    let tplData = new TemplateData(renderData, parentTpl, this._renderData);

    /* 以下两句貌似在上一句new中赋值了，所以注释掉 */

    // 如果为跟节点，则合并跟节点信息
    if (isRoot) {
      Object.assign(
        tplData.constraints || {},
        this._renderData.constraints || {},
      );
    }

    if (!isRoot && renderData && renderData.modelName) {
      // 如果该节点有模型名称，则进入下一层模板

      const tplDataSub = Template.parse(renderData, null, this._templateList);
      tplData = Template._assignObj(tplData, tplDataSub, nd);
    } else if (renderData && renderData.children) {
      // 遍历结构树
      renderData.children.forEach((childRenderData: any) => {
        Template.parse(childRenderData, tplData, this._templateList);
      });
    }
    return tplData;
  }

  /**
   * 数据节点合并
   * 基础规则：大节点属性合并子节点属性
   * 约束合并规则：大节点【约束属性值】覆盖小节点【约束属性值】
   * 子节点合并规则：小节点加入大节点的子节点序列
   * 样式合并规则： 大节点【样式属性值】 覆盖小节点【样式属性值】
   * 特殊规则：小节点特殊属性覆盖大节点属性
   */
  static _assignObj(_target: any = {}, _subNode: any = {}, _nd: any) {
    const target = _target;
    const subNode = _subNode;
    const nd = _nd;
    if (Object.keys(nd.attrs).includes(_SYMBOL.useTag)) {
      nd.tagName = subNode.tagName;
      // 删除标记
      delete nd.attrs[_SYMBOL.useTag];
    }
    // 重新复制元素数据关系
    target.children.push(...subNode.children);
    target.children.forEach((_child: any) => {
      const child: any = _child;
      child.parentId = target.id;
      child.parent = target;
    });
    target.text = subNode.text;
    target.id = subNode.id;
    target.constraints = Object.assign(subNode.constraints, target.constraints);
    target.styles = Object.assign(subNode.styles, target.styles);
    return target;
  }

  // 构建对象属性
  _parseProp(_refData: any, _nd: any) {
    const refData = _refData;
    const nd = _nd;

    refData.tagName = nd.tagName;
    refData.isClosedTag = nd.isClosedTag;
    Object.keys(nd.attrs).forEach(key => {
      const value = nd.attrs[key];
      if (~key.indexOf(_SYMBOL.method)) {
        // 方法
        this._parseMethod(refData, key.slice(1), value);
      } else if (~key.indexOf(_SYMBOL.var)) {
        // 变量
        this._parseVar(refData, key.slice(1), value);
      } else {
        // 普通属性
        Template.setAttr(refData, key, value);
      }
    });
  }

  // 编译命令
  _parseMethod(refData: any, funcName: any, value: any) {
    // Type of `func` is `Function`
    const that: any = this;
    const func = that._methods[funcName];
    if (func) {
      func.call(this, refData);
    } else {
      Loger.error(`template function [${funcName}] doesn't exist!`);
    }
  }

  // 编译变量属性
  _parseVar(refData: any, varName: any, value: any) {
    let newValue = null;
    const that: any = this;
    if (~value.indexOf('()')) {
      const funcName: string = value.slice(0, -2);
      // 如果是函数
      if (that[funcName]) {
        // 如果存在函数
        try {
          newValue = that[funcName].call(this, refData);
        } catch (e) {
          Loger.error(
            `Template.js [id:${refData.id}]'s template [${
              this._name
            }] function [${funcName}] error: ${e}`,
          );
          return;
        }
      } else {
        Loger.error(`template function [${funcName}] doesn't exist!`);
        return;
      }
    } else {
      const keys = Object.keys(refData);
      const args = Object.keys(refData).map(key => refData[key]);
      try {
        newValue = new Function(...keys, `return ${value}`).call(this, ...args);
      } catch (e) {
        Loger.error(`template function [${value}] error: ${e}`);
      }
    }
    Template.setAttr(refData, varName, newValue);
  }

  // 设置普通属性

  static setAttr(refData: any, prop: any, value: any): void {
    const target = Object.keys(refData).includes(prop)
      ? refData
      : refData.tplAttr;

    if (typeof target[prop] === 'object') {
      if (typeof value !== 'object') {
        return;
      }
      Object.assign(target[prop], value);
    } else {
      target[prop] = value;
    }
  }

  static getModelTemplate(TemplateList: any, modelName: any) {
    const o: any = TemplateList.find(
      (n: any) =>
        n.name.toLowerCase() ===
        `${modelName}`.toLowerCase().replace(/-/gim, ''),
    );
    return o;
  }

  static parse(renderData: any, parentTpl: any, TemplateList: any) {
    let tplData: any;

    try {
      const ModelTpl =
        Template.getModelTemplate(TemplateList, renderData.modelName) ||
        Template;
      const tpl = new ModelTpl(renderData, parentTpl, TemplateList);
      tplData = tpl.parse().getData();
    } catch (e) {
      const { id } = renderData;
      Loger.error(
        `template.js [parse] params[renderData.id:${id},parentTpl:${parentTpl}].
                error:${e}`,
      );
    }
    return tplData;
  }
}

export default Template;
