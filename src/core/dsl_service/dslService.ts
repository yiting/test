// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
import ModelProcess from '../dsl_layout/model/index';
import WidgetProcess from '../dsl_layout/widget/index';
import UnionProcess from '../dsl_layout/union/index';
// 暂时起名为Layout模块
import LayoutProcess from '../dsl_layout/layout';
// import InterfereModelProcess from './interfereModel/index';
import GroupProcess from '../dsl_layout/group/index';
import GridProcess from '../dsl_layout/grid/index';
import RenderProcess from '../dsl_render';
import NodeCleanProcess from '../dsl_layout/clean/index';
import LayoutCleanProcess from '../dsl_layout/layout/clean';
// import Model from './model/model';
import Store from '../dsl_helper/store';

import BuilderMap from './builderMap';
/**
 * dsl服务的主使用接口
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 * @return {Object}
 */
function _process(_input: any, _options: any): object {
  const input: any = _input || {};
  let processDesc;
  try {
    // 参数的初始化处理
    _initInput(input);
    // 初始化进程参数
    let option = _initOptions(_options);
    let outpupMap: any = BuilderMap;
    let outputType = option.outputType;
    let builder = outpupMap[outputType];
    // 数据清洗
    let nodes = input.nodes;
    processDesc = '数据清洗';
    nodes = NodeCleanProcess(nodes);
    processDesc = '构建节点';
    let layoutNodes = ModelProcess(nodes, builder.modelList);
    // 干预处理
    // processDesc = '干预处理';
    // layoutNodes = InterfereModelProcess(layoutNodes);
    // 生成树
    processDesc = '节点分组';
    let dslTree = GroupProcess(layoutNodes);
    // 模型识别模块
    processDesc = '组合初始化';
    UnionProcess(dslTree, builder.unionList);
    // 栅格化
    processDesc = '栅格化';
    GridProcess(dslTree);
    // 模型识别模块
    processDesc = '模型初始化';
    WidgetProcess(dslTree, builder.widgetList);

    // 进行布局及循环处理
    processDesc = '布局分析';
    LayoutProcess(dslTree);
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
