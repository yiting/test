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
    outputType: 'ark',
    designWidth: 667,
    optimizeWidth: 667,
    optimizeHeight: 750,
    showTagAttrInfo: false,
    isLocalTest: true,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
  },
);

// // 输出文件
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.xml'),
  value.xml,
);
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.json'),
  JSON.stringify(value.json),
);
