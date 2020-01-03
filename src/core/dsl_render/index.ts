import fs from 'fs';
// builder
import H5Builder from './h5/builder';
import FlutterBuilder from './flutter/builder';
import QLog from '../dsl_service_ts/helper/qlog';
import Store from '../dsl_service_ts/helper/store';
import { debug } from 'util';
const Loger = QLog.getInstance(QLog.moduleData.render);

const builderMap: any = {
  h5: H5Builder,
  flutter: FlutterBuilder,
};
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
function handle(dslTree: any) {
  Loger.debug('render/render.ts [handle] start');
  let builder: any;
  let outputType = Store.get('outputType');
  let Builder = builderMap[outputType];

  Loger.debug('render/render.ts [new Builder]');
  builder = new Builder(dslTree);
  return builder;
}

export default {
  outputFileWithPath,
  handle,
};
