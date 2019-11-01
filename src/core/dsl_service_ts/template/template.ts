// 假设模板
/* let __tpl = `./html/templatelist
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
  objVar: '@',
  objAttr: ':',
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
    this._renderData = args[0];
    this._parentTpl = args[1];
    this._templateList = args[2];
    this._name = 'layer';
    // 节点引用
    this.$ref = this._renderData || {};
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
      let d: any = this._traversal(this._structure, this._parentTpl, true);
      let rootIndex = 0;
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
    let arr = [];
    for (let index = 0; index < structure.length; index++) {
      let nodeInfo: any = structure[index];
      // 构建数据对象
      let { tplData, renderData } = this._parseObj(nodeInfo, parentTpl, isRoot);
      // 赋值
      this._parseProp(tplData, nodeInfo);
      // 遍历子节点
      this._traversal(nodeInfo.children, tplData, false);
      /* if (!isRoot && renderData && renderData.modelName) {
              // 如果该节点有模型名称，则进入下一层模板
              let tplDataSub = Template.parse(
                renderData,
                null,
                this._templateList,
              );
              tplData = Template._assignObj(tplData, tplDataSub, nodeInfo);
            } else  */
      if (renderData && renderData.children) {
        // 遍历结构树
        renderData.children.forEach((childRenderData: any) => {
          Template.parse(childRenderData, tplData, this._templateList);
        });
      }
      // 如果为模板虚拟节点，则自动构建坐标
      if (!tplData.type) {
        if (tplData.children.length) {
          // 如果有子节点，按子节点范围处理
          tplData.resize();
        } else {
          // 如果没有子节点，按父节点属性处理
          tplData.relay();
        }
        // tplData.modelName = null;
      }
      arr.push(tplData);
    }
    if (parentTpl) {
      parentTpl.children.push(...arr);
    }
    return arr;
  }

  // 根据模板节点，构建数据节点
  /**
   *
   * @param _nd 模板节点
   * @param parentTpl 父模板
   * @param isRoot 是否跟节点
   */
  _parseObj(_nd: any, parentTpl: any, isRoot: any) {
    let nodeInfo = _nd;
    let refIndex = nodeInfo.attrs[_SYMBOL.ref];
    let renderData;
    // 删除「引用」字段
    delete nodeInfo.attrs[_SYMBOL.ref];
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

    return { tplData, renderData };
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
    let target = _target;
    let subNode = _subNode;
    let nodeInfo = _nd;
    if (Object.keys(nodeInfo.attrs).includes(_SYMBOL.useTag)) {
      nodeInfo.tagName = subNode.tagName;
      target.tagName = subNode.tagName;
      // 删除标记
      delete nodeInfo.attrs[_SYMBOL.useTag];
    }
    // 重新复制元素数据关系
    target.children.push(...subNode.children);
    target.children.forEach((_child: any) => {
      let child: any = _child;
      child.parentId = target.id;
      child.parent = target;
    });
    target.text = subNode.text;
    target.id = subNode.id;
    target.constraints = Object.assign(subNode.constraints, target.constraints);
    target.styles = Object.assign(subNode.styles, target.styles);
    Object.assign(target.tplAttr, subNode.tplAttr);
    return target;
  }

  // 构建对象属性
  _parseProp(_refData: any, _nd: any) {
    let refData = _refData;
    let nodeInfo = _nd;

    refData.tagName = nodeInfo.tagName;
    refData.isClosedTag = nodeInfo.isClosedTag;
    Object.keys(nodeInfo.attrs).forEach(key => {
      let value = nodeInfo.attrs[key];
      if (~key.indexOf(_SYMBOL.objVar)) {
        // 变量
        let _key = key.slice(1);
        let _val = this._parseVar(refData, _key, value);
        if (_val !== null) {
          Template.setVar(refData, _key, _val);
        }
      } else if (~key.indexOf(_SYMBOL.objAttr)) {
        // 变量
        let _key = key.slice(1);
        let _val = this._parseVar(refData, _key, value);
        if (_val !== null) {
          Template.setAttr(refData, _key, _val);
        }
      } else if (~key.indexOf(_SYMBOL.each)) {
      } else if (~key.indexOf(_SYMBOL.useTag)) {
      } else if (~key.indexOf(_SYMBOL.ref)) {
      } else {
        // 普通属性
        Template.setAttr(refData, key, value);
      }
    });
  }

  // 编译变量属性
  _parseVar(refData: any, varName: any, value: any) {
    let newValue = null;
    let that: any = this;
    if (~value.indexOf('()')) {
      let funcName: string = value.slice(0, -2);
      // 如果是函数
      if (that[funcName]) {
        // 如果存在函数
        try {
          newValue = that[funcName].call(this, refData);
        } catch (e) {
          Loger.error(
            `Template/template.js [id:${refData.id}] template [${
              this._name
            }]'s method [${funcName}] run error: ${e}`,
          );
          return;
        }
      } else {
        Loger.error(`template function [${funcName}] doesn't exist!`);
        return;
      }
    } else {
      let keys = Object.keys(refData);
      let args = Object.keys(refData).map(key => refData[key]);
      try {
        newValue = new Function(...keys, `return ${value}`).call(this, ...args);
      } catch (e) {
        Loger.error(`template function [${value}] error: ${e}`);
      }
    }
    return newValue;
  }

  // 设置普通属性

  static setAttr(refData: any, prop: any, value: any): void {
    if (typeof refData.tplAttr[prop] === 'object') {
      if (typeof value !== 'object') {
        return;
      }
      Object.assign(refData.tplAttr[prop], value);
    } else {
      refData.tplAttr[prop] = value;
    }
  }

  static setVar(refData: any, prop: any, value: any): void {
    if (typeof refData[prop] === 'object') {
      if (typeof value !== 'object') {
        return;
      }
      Object.assign(refData[prop], value);
    } else {
      refData[prop] = value;
    }
  }

  static getModelTemplate(TemplateList: any, Model: any) {
    let o: any = TemplateList.find(
      (temp: any) => temp.name === Model.constructor.name,
    );
    return o;
  }

  static parse(renderData: any, parentTpl: any, TemplateList: any) {
    let tplData: any;
    try {
      if (renderData.id == '3D6DE57E-88DE-45B5-AE38-E1C8B6CB9000_0') debugger;
      let ModelTpl =
        Template.getModelTemplate(TemplateList, renderData) || Template;
      if (ModelTpl) {
        let tpl = new ModelTpl(renderData, parentTpl, TemplateList);
        tplData = tpl.parse().getData();
      }
    } catch (e) {
      let { id } = renderData;
      Loger.error(
        `template.js [parse] params[renderData.id:${id},parentTpl:${parentTpl}].
                error:${e}`,
      );
    }
    return tplData;
  }
}

export default Template;
