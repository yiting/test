import { Context } from 'koa';
import * as imageMacApi from './imageMacApi';
import ImgCombine from '../../core/designimage/img_combine';
import qlog from '../../core/log/qlog';
const logger = qlog.getInstance(qlog.moduleData.img);
let startTime = 0;

export async function combineNode(context: Context) {
  const { request } = context;
  const { param } = request.body;
  const imgCombine = new ImgCombine();
  imgCombine.init(param);
  const { node } = param;
  const result = await imgCombine.combineNode(node, {});
  const res = context.response;
  res.body = result;
}

export async function combineNodes(context: Context) {
  const { request } = context;
  let { sketchPath, imgList, pageId } = request.body;
  let promiselist = [];
  let projectName = sketchPath.substring(
    sketchPath.lastIndexOf('/') + 1,
    sketchPath.lastIndexOf('.sketch'),
  );
  for (let i = 0, ilen = imgList.length; i < ilen; i++) {
    if (i != 0) {
      // continue;
    }
    let imageCombine = new ImgCombine();
    imageCombine.init({
      generateId: 'img' + (i + 1),
      projectName: projectName,
      pageId: pageId,
    });
    let promise = imageCombine.combineNode(imgList[i], {});
    promiselist.push(promise);
  }

  //2018-10-29
  startTime = new Date().getTime();
  logger.debug('[edit.js-combineImages]开始生成' + imgList.length + '张图片');

  if (context.originalUrl.indexOf('imgs_combine') > -1) {
    //直接调用接口，需要有response返回
    return Promise.all(promiselist).then(result => {
      var costTime = (new Date().getTime() - startTime) / 1000;
      logger.debug(
        '[edit.js-combineImages]生成图片完毕，用时' + costTime + '秒',
      );
      // console.log(result);
      const res = context.response;
      res.body = result;
    });
  } else {
    //通过generate调用接口，只要返回promise
    return Promise.all(promiselist);
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
  let { sketchPath, imgList } = request.body;
  try {
    //下载sketch
    await imageMacApi.downloadSketch(context);

    //绘图
    let result = await combineNodes(context);

    var costTime = (new Date().getTime() - startTime) / 1000;
    logger.debug('[edit.js-combineImages]生成图片完毕，用时' + costTime + '秒');

    const res = context.response;
    res.body = result;
  } catch (e) {
    const res = context.response;
    res.body = e;
  }
}
