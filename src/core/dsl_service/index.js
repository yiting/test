// dsl模块服务通过输入设计稿抽象过后的数据，然后输出对应的字符串
const Common = require('./dsl/dsl_common');
const Dsl = require('./dsl/dsl');
const Render = require('./render/render');

/**
 * dsl服务的主使用接口
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 * @return {Object}
 */
let process = function(input, options) {
  let output = {};
  input = input ? input : {};
  options = options ? options : {};
  // 参数的初始化处理
  _initProcessParam(input, options);
  // 调用DSL模块
  let dslTree = Dsl.process(
    input.nodes,
    options.optimizeWidth,
    options.optimizeHeight,
    Common.FlexLayout,
  );
  // 调用Render模块输出
  // let config = Dsl.config();
  // let render = Render.process(dslTree, Common.FlexLayout, config);

  // let htmlStr = render.getTagString();
  // let cssStr = render.getStyleString();

  // output.uiString = htmlStr;
  // output.styleString = cssStr;
  return output;
};

/**
 * 对主服务接口的参数初始化处理
 * @param {Object} input 输入的参数
 * @param {Object} options 参数设定
 */
let _initProcessParam = function(input, options) {
  // input的设定
  // input.nodes, 输入的数据源
  if (!input.nodes || !input.nodes.length) {
    input.nodes = [];
  }

  // options的设定
  // options.outputType, 输出数据的类型, 默认h5,
  if (!input.outputType) {
    input.outputType = 'h5';
  } else {
    // 暂不处理
    input.outputType = 'h5';
  }

  // options.optimizeWidth, options.optimizeHeight 匹配范围的优化
  // 暂不处理
  options.optimizeWidth = 750;
  options.optimizeHeight = 750;

  // options.layoutType, 布局的处理
  // 暂不处理
  options.layoutType = Common.FlexLayout;
};

module.exports = {
  process,
};
