// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
import Common from './dsl2/common';
import ModelProcess from './model/index';
// 暂时起名为Layout模块
import Layout from './layout/layout';
import GroupProcess from './group/index';
import RenderProcess from './render/render';
import CleanProcess from './clean/manage';
import Store from './helper/store';

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
    _initOptions(_options);
    // 数据清洗
    let nodes = input.nodes;
    nodes = CleanProcess(nodes);

    // 模型识别模块
    const models = ModelProcess(nodes);

    // layout模块
    let dslTree: any;
    // 生成dsl树, 传入match的组件模型和元素模型
    dslTree = GroupProcess(models);
    processDesc = '生成dsl树出错';
    // 进行布局及循环处理
    Layout.handle(dslTree);

    // render模块
    const Builder = RenderProcess.handle(dslTree);
    return Builder.getResult();
  } catch (e) {
    console.error(`dslService.ts  ${processDesc}`);
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
    optimizeWidth: 750,
    optimizeHeight: 750,
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
  };
  Object.assign(processOption, options);
  // 设置全局变量
  Store.assign(processOption);
}

process.on('message', msg => {
  const res = _process(msg._input, msg._options);
  process.send(res);
});

export default {
  process: _process,
};
