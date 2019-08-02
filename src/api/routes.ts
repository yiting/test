//1.designjson
import { init, parse } from './controller/designPost';
import designPostV2 from './controller/designPostV2';

//2.designimage
import * as imgApiV2 from './controller/imageApiV2';
// import * as imgApi from './controller/imageApi';
// import * as imageMacApi from './controller/imageMacApi';
import * as imageMacApiV2 from './controller/imageMacApiV2';
//测试
// import * as testImgMacApi from './controller/testImgMacApi';
// import * as testImgApi from './controller/testImgApi';

//3.dsl、render
import dslApi from './controller/dslApi';

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
    path: '/designinit/v2',
    method: 'post',
    action: designPostV2.init,
  },
  {
    path: '/designparse/v2',
    method: 'post',
    action: designPostV2.parse,
  },
  // {
  //   path: '/test_img_downloadSketch',
  //   method: 'get',
  //   action: testImgMacApi.testDownload,
  // },
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
    path: '/img_makeImgsByUpdateSketch_v2',
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
    action: imgApiV2.generate,
  },
  {
    path: '/img_generate_v2',
    method: 'post',
    action: imgApiV2.generateV2,
  },
  {
    path: '/img_preview',
    method: 'post',
    action: imageMacApiV2.preview,
  },
  {
    path: '/img_preview_v2',
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
    path: '/getVersion',
    method: 'post',
    action: version.getVersion,
  },
];
