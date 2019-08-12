import { Context } from 'koa';
import * as imageMacApi from './imageMacApiV2';
import ImgCombine from '../../core/designimage/img_combine_v2';
import ImgCombineMac from '../../core/designimage/img_combine_mac_v2';
import qlog from '../../core/log/qlog';
import util from '../../core/designimage/helper/util';
import store from '../../core/designimage/helper/store';
import { existsSync } from 'fs';
let logger: any = undefined;
let startTime = 0;

export async function combineNodes(context: Context) {
  const { request } = context;
  let { sketchPath, imgList, pageId } = request.body;
  let promiselist = [];
  let projectName = sketchPath.substring(
    sketchPath.lastIndexOf('/') + 1,
    sketchPath.lastIndexOf('.sketch'),
  );
  // for (let i = 0, ilen = imgList.length; i < ilen; i++) {
  // if (i != 0) {
  //   // continue;
  // }
  let imageCombine = new ImgCombine();
  imageCombine.init({
    // generateId: 'img' + (i + 1),
    projectName: projectName,
    pageId: pageId,
  });
  let promise = imageCombine.combineNodes(imgList, {});
  // promiselist.push(promise);
  // }

  //2018-10-29
  startTime = new Date().getTime();
  logger.debug('[edit.js-combineImages]开始生成' + imgList.length + '张图片');

  if (context.originalUrl.indexOf('imgs_combine') > -1) {
    //直接调用接口，需要有response返回
    return promise.then((result: any) => {
      var costTime = (new Date().getTime() - startTime) / 1000;
      logger.debug(
        '[edit.js-combineImages]生成图片完毕，用时' + costTime + '秒',
      );
      let imageCombine = new ImgCombine();
      let logData = imageCombine.getLogData();
      logger.debug(
        '直接生成的有' + logData.num._combineShapeGroupNodeWithNative + '张',
      );
      // console.log(result);
      const res = context.response;
      res.body = result;
    });
  } else {
    //通过generate调用接口，只要返回promise
    return promise;
  }

  // const imgCombine = new ImgCombine();
  // imgCombine.init(param);
  // const { node } = param;
  // const result = await imgCombine.combineNode(node, {});
  // const res = context.response;
  // res.body = result;
}

export async function generate(context: Context) {
  const { request } = context;
  let { sketchPath, imgList, options } = request.body;
  let {
    applyInfo_user: userName,
    applyInfo_url: url,
    applyInfo_proName: projectName,
  } = options;
  try {
    util.storeLoginData(context);

    logger = qlog.getInstance(store.getAll());

    if (!existsSync('./data/upload_file/' + projectName)) {
      //下载sketch
      await imageMacApi.downloadSketch(context);
    }

    //绘图
    let result = await combineNodes(context);

    var costTime = (new Date().getTime() - startTime) / 1000;
    logger.debug('[edit.js-combineImages]生成图片完毕，用时' + costTime + '秒');

    // let imageCombine = new ImgCombine();
    // let nodes = imageCombine.getDirectNodes();
    // logger.debug("directNodes:"+nodes.join(","));
    // throw 'error';
    const res = context.response;
    res.body = result;
  } catch (e) {
    const res = context.response;
    res.body = e;
  }
}

function makeResult(context: Context) {
  var res = context.response;
  var result = {
    state: 1,
    msg: '',
    data: res.body,
  };
  if (typeof res.body == 'string') {
    result.state = 0;
    result.msg = res.body;
    result.data = [];
  }
  res.body = result;
}

export async function generateV2(context: Context) {
  await generate(context);
  makeResult(context);
}
