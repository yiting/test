import Path from 'path';
import designjson from './test.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';
import Render from '../../dsl_render/index';
import dslServer from '../dslService';
const value: any = dslServer.process(
  {
    nodes: designjson,
  },
  {
    outputType: 'flutter',
    designWidth: 750,
    showTagAttrInfo: true,
    tplType: -1,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
  },
);
// // 输出文件
Render.outputFileWithPath(
  Path.join(__dirname, './output/main.dart'),
  value.main_dart,
);
