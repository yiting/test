// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
import Common from './dsl2/common';
import Dsl from './dsl2/dsl';
// 暂时起名为Layout模块
import Layout from './layout/layout';
import Group from './layout/group';
import Render from './render/render';
import Store from './helper/store';
import { debug } from 'util';

/**
 * dsl服务的主使用接口
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 * @return {Object}
 */
function _process(_input: any, _options: any): object {
  const output: any = {};
  const input: any = _input || {};
  // 参数的初始化处理
  _initInput(input);
  // 初始化进程参数
  _initOptions(_options);

  // 模型识别模块
  const dslModel = Dsl.pipe(input.nodes);
  // 调用Render模块输出
  const config = Dsl.config();

  // layout模块
  let dslTree: any;
  try {
    // 生成dsl树, 传入match的组件模型和元素模型
    const arr = [];
    arr.push(...dslModel.widgets);
    arr.push(...dslModel.elements);
    dslTree = Group.handle(arr, dslModel.bodyModel);
  } catch (e) {
    console.log('生成dsl树出错');
  }

  try {
    // 进行布局及循环处理
    Layout.handle(dslTree);
  } catch (e) {
    console.log('布局处理出错');
  }

  // render模块
  const render = Render.pipe(
    dslTree,
    config,
  );
  const htmlStr = render.getTagString();
  const cssStr = render.getStyleString();

  output.uiString = htmlStr;
  output.styleString = cssStr;
  return output;
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
    outputType: 'h5',
    // options.optimizeWidth, options.optimizeHeight 匹配范围的优化
    optimizeWidth: 750,
    optimizeHeight: 750,
    designWidth: 750,
    designHeight: 750,
    // 布局类型
    layoutType: Common.FlexLayout,
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
