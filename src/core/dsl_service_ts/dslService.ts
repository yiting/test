// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
import Common from './dsl/common';
import Dsl from './dsl/dsl';
import Render from './render/render';
import Store from './helper/store';

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
  // 调用DSL模块
  const dslTree = Dsl.pipe(input.nodes);

  // 调用Render模块输出
  const config = Dsl.config();
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
    // 布局类型
    layoutType: Common.FlexLayout,
    // 调试模式
    isLocalTest: false,
    // 显示标签属性
    showTagAttrInfo: true,
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
