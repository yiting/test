import Path from 'path';
import designjson from './test.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';

import Render from '../render/index';
import dslProcess from '../process';

/* const dslTree = Dsl.pipe(
    designjson,
    {
        optimizeWidth: 750,
        optimizeHeight: 750,
    },
); */
dslProcess(
  {
    nodes: designjson,
  },
  {
    optimizeWidth: 750,
    optimizeHeight: 750,
  },
).then((res: any) => {
  const htmlStr = res.uiString;
  const cssStr = res.styleString;
  // // 输出文件
  Render.outputFileWithPath(
    Path.join(__dirname, './output/index.html'),
    htmlStr,
  );
  Render.outputFileWithPath(Path.join(__dirname, './output/index.css'), cssStr);
});
