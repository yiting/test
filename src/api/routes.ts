//1.designjson
import { init, parse } from './controller/designPost';
import designPost_v2 from './controller/designPost.v2';

//2.designimage
// import * as imgApiV2 from './controller/imageApiV2';
// import * as imgApi from './controller/imageApi';
// import * as imageMacApi from './controller/imageMacApi';
import * as imageMacApiV2 from './controller/imageMacApiV2';
//测试
// import * as testImgMacApi from './controller/testImgMacApi';
// import * as testImgApi from './controller/testImgApi';

//3.dsl、render
import dslApi from './controller/dslApi';
import arkApi from './controller/arkApi';
import dslApi_v2 from './controller/dslApi.v2';
import arkApi_v2 from './controller/arkApi.v2';

import * as version from './controller/version';

export default [
  {
    path: '/designinit',
    method: 'post',
    action: init,
  },
  {
    path: '/designparse',
    method: 'post',
    action: parse,
  },
  {
    path: '/v2/designinit',
    method: 'post',
    action: designPost_v2.init,
  },
  {
    path: '/v2/designparse',
    method: 'post',
    action: designPost_v2.parse,
  },
  {
    path: '/v2/img_downloadSketch',
    method: 'get',
    action: imageMacApiV2.downloadSketch,
  },
  {
    path: '/v2/img_getFonts',
    method: 'post',
    action: imageMacApiV2.getFonts,
  },
  // {
  //   path: '/test_makeImg',
  //   method: 'get',
  //   action: testImgMacApi.testMakeImg,
  // },
  // {
  //   path: '/test_makeImgByUpdateSketch',
  //   method: 'get',
  //   action: testImgMacApi.makeImgByUpdateSketch,
  // },
  // {
  //   path: '/test_imgCombineSimple',
  //   method: 'get',
  //   action: testImgApi.testImgCombineSimple,
  // },
  // {
  //   path: '/test_imgCombine',
  //   method: 'get',
  //   action: testImgApi.testImgCombine,
  // },
  // {
  //   path: '/test_imgGenerate',
  //   method: 'get',
  //   action: testImgApi.testImgGenerate,
  // },
  // {
  //   path: '/img_downloadSketch',
  //   method: 'post',
  //   action: imageMacApi.downloadSketch,
  // },
  // {
  //   path: '/img_makeImg',
  //   method: 'post',
  //   action: imageMacApi.makeImg,
  // },
  // {
  //   path: '/img_makeImgByUpdateSketch',
  //   method: 'post',
  //   action: imageMacApi.makeImgByUpdateSketch,
  // },
  {
    path: '/v2/img_makeImgsByUpdateSketch',
    method: 'post',
    action: imageMacApiV2.makeImgsByUpdateSketch,
  },
  // {
  //   path: '/img_combine',
  //   method: 'post',
  //   action: imgApi.combineNode,
  // },
  // {
  //   path: '/imgs_combine',
  //   method: 'post',
  //   action: imgApi.combineNodes,
  // },
  // {
  //   path: '/img_generate',
  //   method: 'post',
  //   action: imgApi.generate,
  // },
  {
    path: '/img_generate',
    method: 'post',
    action: imageMacApiV2.generate,
  },
  {
    path: '/v2/img_generate',
    method: 'post',
    action: imageMacApiV2.generateV2,
  },
  {
    path: '/img_preview',
    method: 'post',
    action: imageMacApiV2.preview,
  },
  {
    path: '/v2/img_preview',
    method: 'post',
    action: imageMacApiV2.previewV2,
  },
  {
    path: '/imgData',
    method: 'get',
    action: imageMacApiV2.getImgData,
  },
  {
    path: '/dsl_process',
    method: 'post',
    action: dslApi,
  },
  {
    path: '/ark_process',
    method: 'post',
    action: arkApi,
  },
  {
    path: '/v2/dsl_process',
    method: 'post',
    action: dslApi_v2,
  },
  {
    path: '/v2/ark_process',
    method: 'post',
    action: arkApi_v2,
  },
  {
    path: '/getVersion',
    method: 'post',
    action: version.getVersion,
  },
  {
    path: '/v2/getVersion',
    method: 'post',
    action: version.getVersionV2,
  },
];
