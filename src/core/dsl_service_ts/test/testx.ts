import Path from 'path';
import designjson from './test.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';
import Render from '../render/index';
import dslServer from '../dslService';
const value: any = dslServer.process(
  {
    nodes: designjson,
  },
  {
    outputType: 'h5',
    designWidth: 750,
    showTagAttrInfo: true,
    isLocalTest: true,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
    groups: [
      {
        type: 'group',
        ids: [
          '914B9A6E-0090-4953-A025-A631E569238F',
          'BC87756C-C291-4FE9-A0EE-D2AAB914B94B',
          'AB9C221D-540D-4326-AB44-678D228007FC',
          '309CD979-83FB-4D90-89E9-E8A23AD41A1B',
          '1243D9AA-5D65-49D5-A243-0CF5BF5CD2DF',
        ],
      },
      {
        type: 'group',
        ids: [
          '6E90C97B-FB9F-4B60-A3BA-AB40422B96C8',
          'C27A80BB-B89A-49AE-8A05-B8A0B68D9E6A',
          '27180B2A-8131-476B-BFAB-1DC88BD341A6',
          'B61B387D-C15A-4B07-87F2-BB5F1E6F2696',
          'C367BDC2-A624-427C-A412-EA0006584E1D',
        ],
      },
    ],
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
