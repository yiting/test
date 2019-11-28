import fs from 'fs';
// builder
import H5Builder from './h5/builder';
import ArkBuilder from './ark/builder';
// template
import H5TemplateList from '../template/html/list';
import ArkTemplateList from '../template/ark/templatelist';
// template engine
import Template from '../template/template';
import TemplateData from '../template/templateData';
import QLog from '../log/qlog';
import Store from '../helper/store';
const Loger = QLog.getInstance(QLog.moduleData.render);

const builderMap: any = {
  h5: H5Builder,
  ark: ArkBuilder,
};
const templateMap: any = {
  h5: H5TemplateList,
  ark: ArkTemplateList,
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
  TemplateData.reset();
  // const renderJSON = dslTree.toJSON();
  let builder: any;
  let templateData: any;
  const outputType = Store.get('outputType');
  const Builder = builderMap[outputType];
  const TemplateList = templateMap[outputType];

  try {
    // 这里直接使用h5 builder
    Loger.debug('render/render.ts [Template parse]');
    templateData = Template.parse(dslTree, null, TemplateList);

    Loger.debug('render/render.ts [new Builder]');
    builder = new Builder(templateData);
  } catch (e) {
    Loger.error(`render/render.ts [handle] ${e}`);
  }
  return builder;
}

export default {
  outputFileWithPath,
  handle,
};
