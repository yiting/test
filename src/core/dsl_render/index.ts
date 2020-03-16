import fs from 'fs';
// builder
import QLog from '../dsl_helper/qlog';
const Loger = QLog.getInstance(QLog.moduleData.render);

/**
 *
 * @param {*} dslTree
 */
function con(data: any) {
  if (data.children) {
    data.children.forEach((nd: any) => con(nd));
  }
}
/**
 * 根据路径输出字符串
 * @param {String} path
 * @param {String} string
 */
function outputFileWithPath(path: string, string: string) {
  try {
    fs.writeFile(path, string, err => {
      if (err) {
        Loger.info(err);
      } else {
        Loger.info(`${path}生成成功`);
      }
    });
  } catch (e) {
    Loger.error(
      `render/render.ts [outputFileWithPath]:${e}, params[path:${path},string:${string}]`,
    );
  }
}

/**
 * 方法
 * @param {DslTree} dslTree
 */
function handle(dslTree: any, Builder: any) {
  Loger.debug('render/render.ts [new Builder]');
  return new Builder(dslTree);
}

export default {
  outputFileWithPath,
  handle,
};
