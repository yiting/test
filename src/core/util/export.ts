import fs from 'fs-extra';

/**
 * 输出文件
 * @param {String} filePath 文件路径
 * @param {String} data
 */
export function exportStr(filePath: string, str: string): Promise<any> {
  if (!filePath || !str) {
    throw new Error('[export.js-exportStr]参数有误');
  }
  return fs.outputFile(filePath, str);
}

/**
 * 输出html文件
 * @param {String} path
 * @param {String} name
 * @param {String} data
 */
export function exportHtml(
  path: string,
  name: string,
  data: string,
): Promise<any> {
  if (!path || !name || !data) {
    throw new Error('[export.js-exportHtml]参数有误');
  }
  const filePath = `${path}/${name}.html`;
  return exportStr(filePath, data);
}

/**
 * 输出css文件
 * @param {String} path
 * @param {String} name
 * @param {String} data
 */
export function exportCss(
  path: string,
  name: string,
  data: string,
): Promise<any> {
  if (!path || !name || !data) {
    throw new Error('[export.js-exportCss]参数有误');
  }
  const filePath = `${path}/${name}.css`;
  return exportStr(filePath, data);
}

/**
 * 输出jade文件
 * @param {String} path
 * @param {String} name
 * @param {String} data
 */
export function exportJade(
  path: string,
  name: string,
  data: string,
): Promise<any> {
  if (!path || !name || !data) {
    throw new Error('[export.js-exportJade]参数有误');
  }
  const filePath = `${path}/${name}.jade`;
  return exportStr(filePath, data);
}

/**
 * 输出sass文件
 * @param {String} path
 * @param {String} name
 * @param {String} str
 */
export function exportSass(
  path: string,
  name: string,
  data: string,
): Promise<any> {
  if (!path || !name || !data) {
    throw new Error('[export.js-exportSass]参数有误');
  }
  const filePath = `${path}/${name}.sass`;
  return exportStr(filePath, data);
}
