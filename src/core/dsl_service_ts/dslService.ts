// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
import ModelProcess from '../dsl_layout/model/index';
import WidgetProcess from '../dsl_layout/widget/index';
import ComponentProcess from '../dsl_component/index';
// 暂时起名为Layout模块
import LayoutProcess from '../dsl_layout/layout';
// import InterfereModelProcess from './interfereModel/index';
import GroupProcess from '../dsl_layout/group/index';
import GridProcess from '../dsl_layout/grid/index';
import RenderProcess from '../dsl_render';
import NodeCleanProcess from '../dsl_layout/clean/index';
import LayoutCleanProcess from '../dsl_layout/layout/clean';
// import Model from './model/model';
import Store from '../dsl_layout/helper/store';
import qlog from '../log/qlog';
const logger = qlog.getInstance(qlog.moduleData.all);

import H5ModelList from '../dsl_render/h5/models/modelList';
import H5WidgetList from '../dsl_render/h5/widgets/widgetList';
import FlutterModelList from '../dsl_render/flutter/models/modelList';
import H5Builder from '../dsl_render/h5/builder';
import FlutterBuilder from '../dsl_render/flutter/builder';
import { debug } from 'util';

let outputMap: any = {
  h5: {
    modelList: H5ModelList,
    widgetList: H5WidgetList,
    builder: H5Builder,
  },
  flutter: {
    modelList: FlutterModelList,
    builder: FlutterBuilder,
  },
};

/**
 * dsl服务的主使用接口
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 * @param {number} compileType 测试模型
 * @return {Object}
 */
function _process(_input: any, _options: any, _compileType?: any): object {
  const input: any = _input || {};
  const compileType = parseInt(_compileType) || 0;
  let processDesc;
  try {
    // 参数的初始化处理
    _initInput(input);
    // 初始化进程参数
    let option = _initOptions(_options);

    let outputType = option.outputType;
    let { modelList, widgetList, builder } = outputMap[outputType];
    console.log(outputType);

    // 数据清洗
    let nodes = input.nodes;
    processDesc = '构建节点';
    let layoutNodes = ModelProcess(nodes, modelList);
    // 干预处理
    // processDesc = '干预处理';
    // layoutNodes = InterfereModelProcess(layoutNodes);
    processDesc = '数据清洗';
    layoutNodes = NodeCleanProcess(layoutNodes);
    // 生成树
    processDesc = '节点分组';
    let dslTree = GroupProcess(layoutNodes);
    // 模型识别模块
    processDesc = '模型初始化';
    WidgetProcess(dslTree, widgetList);
    // 栅格化
    processDesc = '栅格化';
    GridProcess(dslTree);

    // 栅格化后测试模型匹配, 测试测试测试----------------
    // if (true) {
    //   try {
    //     logger.info('DSL Service 进入模型匹配流程');
    //     ComponentProcess(dslTree);

    //     // render模块
    //     let Builder = RenderProcess.handle(dslTree, builder);
    //     let res = Builder.getResult();
    //     console.log(res.uiString);
    //     return;
    //     // 测试直接返回
    //     //let Builder = RenderProcess.handle(dslTree);
    //     //return Builder.getResult();
    //   } catch (e) {
    //     console.error(`dslService模型匹配错误  ${processDesc}:${e}`);
    //   }
    // }

    // 进行布局及循环处理
    processDesc = '布局分析';
    LayoutProcess(dslTree);
    // 结构清理
    processDesc = '结构清理';
    dslTree = LayoutCleanProcess(dslTree);
    // render模块
    let Builder = RenderProcess.handle(dslTree, builder);
    return Builder.getResult();
  } catch (e) {
    console.error(`dslService.ts  ${processDesc}:${e}`);
  }
}

/**
 * 对主服务接口的参数初始化处理
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 */
function _initInput(_input: any) {
  // input的设定
  // input.nodes, 输入的数据源
  const input = _input;
  if (!input.nodes || !input.nodes.length) {
    input.nodes = [];
  }
}

function _initOptions(options: any) {
  const processOption: any = {
    // options.outputType, 输出数据的类型, 默认h5,
    // 布局类型
    outputType: options.outputType || 'h5',
    // options.optimizeWidth, options.optimizeHeight 匹配范围的优化
    coordinateWidth: 750, // 平台坐标宽度
    designWidth: 750,
    designHeight: 750,
    // 调试模式
    isLocalTest: false,
    // 显示标签属性
    showTagAttrInfo: true,
    // 误操作系数
    errorCoefficient: 4, //px
    // log信息
    applyInfo_user: options.applyInfo_user || '',
    applyInfo_url: options.applyInfo_url || '',
    applyInfo_proName: options.applyInfo_proName || '',
    // group组合信息
    groups: [],
  };
  Object.assign(processOption, options);
  // 设置全局变量
  Store.assign(processOption);
  return processOption;
}

process.on('message', msg => {
  const res = _process(msg._input, msg._options);
  process.send(res);
});

export default {
  process: _process,
};
