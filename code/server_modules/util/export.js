// export.js

let Utils=require('./utils');

/**
 * 输出文件
 * @param {String} filePath 文件路径
 * @param {String} str
 */
let exportStr = function (filePath, str, callback) {
  if (!filePath || !str) {
    //log('export.js - exportStr: 参数有误')
    logger.warn('[export.js-exportStr]参数有误');
    return
  }
  Utils.writeToFile(filePath, str, callback)
}

/**
 * 输出html文件
 * @param {String} path
 * @param {String} name
 * @param {String} str
 */
let exportHtml = function (path, name, str, callback) {
  if (!path || !name || !str) {
    //log('export.js - exportHtml: 参数有误')
    logger.warn('[export.js-exportHtml]参数有误');
    return
  }
  let filePath = path + '/' + name + '.html'
  exportStr(filePath, str, callback)
}

/**
 * 输出css文件
 * @param {String} path
 * @param {String} name
 * @param {String} str
 */
let exportCss = function (path, name, str, callback) {
  if (!path || !name || !str) {
    //log('export.js - exportCss: 参数有误')
    logger.warn('[export.js-exportCss]参数有误');
    return
  }
  let filePath = path + '/' + name + '.css'
  exportStr(filePath, str, callback)
}

/**
 * 输出jade文件
 * @param {String} path
 * @param {String} name
 * @param {String} str
 */
let exportJade = function (path, name, str, callback) {
  if (!path || !name || !str) {
    //log('export.js - exportJade: 参数有误')
    logger.warn('[export.js-exportJade]参数有误');
    return
  }
  let filePath = path + '/' + name + '.jade'
  exportStr(filePath, str, callback)
}

/**
 * 输出sass文件
 * @param {String} path
 * @param {String} name
 * @param {String} str
 */
let exportSass = function (path, name, str, callback) {
  if (!path || !name || !str) {
    //log('export.js - exportSass: 参数有误')
    logger.warn('[export.js-exportSass]参数有误');
    return
  }
  let filePath = path + '/' + name + '.sass'
  exportStr(filePath, str, callback)
}


module.exports={
    exportStr,
    exportHtml,
    exportCss,
    exportJade,
    exportSass
}