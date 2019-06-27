import Path from 'path';
import designjson from './test7_data.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';
// import Render from '../render/render';
import dslServer from '../dslService';

console.log('节点总长度: ' + designjson.length);
const value: any = dslServer.process(
  {
    nodes: designjson,
  },
  {
    optimizeWidth: 750,
    optimizeHeight: 750,
    showTagAttrInfo: true,
    isLocalTest: true,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
  },
);

// // 输出文件
// Render.outputFileWithPath(
//   Path.join(__dirname, './output/index.html'),
//   value.uiString,
// );
// Render.outputFileWithPath(
//   Path.join(__dirname, './output/index.css'),
//   value.styleString,
// );
