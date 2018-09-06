// this module is a abstract interface. 
//

// 依赖的模块
let sketchParser = require('./designjson_parser_sketch');
let xdParser = require('./designjson_parser_xd');

// 对外接口
module.exports = {
  parse: _parse
}

/**
 * 传入json并解析
 * @param {Json} data 通过sk,ps,xd解析得到的json数据
 * @param {Object} opts 配置参数
 * @param {Int} opts.type 解析json的类型, 1:sketch, 2:ps, 3:xd
 * @param {Object} designArtboard 解析完Artboard储存的对象
 * @param {Object} designSymbol 解析完Symbol储存的对象
 * @param {Object} designStyle 解析完的样式对象
 * @param {Array} designImage 需要合并的图片节点 
 */
let _parse = function(data, opts) {
  switch(opts.type) {
    case 1:
      sketchParser.parse(data, opts);
      break;

    case 2:
      break;

    case 3:
      xdParser.parse(data, opts, designArtboard, designSymbol, designStyle, designImage);
      break;
    
    default:
      break;
  }
}
