// this package is use to translate sketch, photoshop, adobeXD 


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
 */
let _parse = function(data, opts, designArtboard, designSymbol, designStyle) {
    console.log('待处理xd的解析...');
}

