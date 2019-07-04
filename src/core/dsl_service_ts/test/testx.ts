import Path from 'path';
import designjson from './test.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';
import Render from '../render/render';
import dslServer from '../dslService';
const value: any = dslServer.process(
  {
    nodes: designjson,
  },
  {
    designWidth: 1081,
    optimizeWidth: 750,
    optimizeHeight: 375,
    showTagAttrInfo: true,
    isLocalTest: true,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
  },
);

// // 输出文件
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.html'),
  value.uiString,
);
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.css'),
  value.styleString,
);
