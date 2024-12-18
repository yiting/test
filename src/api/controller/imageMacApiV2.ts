import { Context } from 'koa';
// import dslModel from '../../core/dsl_service/index';
import ImgCombineMac from '../../core/designimage/img_combine_mac_v2';
import qlog from '../../core/log/qlog';
import store from '../../core/designimage/helper/store';
import util from '../../core/designimage/helper/util';
import { existsSync } from 'fs';
let logger: any = undefined;
var Url = require('url');
var fs = require('fs');

function getHost(context: Context) {
  return context.origin;
}

export async function downloadSketch(context: Context) {
  let startTime = new Date().getTime();
  const { request } = context;
  const { sketchPath: url } = request.body;
  util.storeLoginData(context);
  logger = qlog.getInstance(store.getAll());
  logger.debug('开始下载设计稿');
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init({});
  let result = await imgCombineMac.downloadSketch(url);
  // 解压缩
  logger.debug('开始解压缩设计稿');
  let projectName = url.substring(
    url.lastIndexOf('/') + 1,
    url.lastIndexOf('.sketch'),
  );
  if (url.indexOf('getSketchFile') > -1) {
    projectName = url.substring(
      url.lastIndexOf('path=') + 5,
      url.lastIndexOf('.sketch'),
    );
  }
  result = await imgCombineMac.unzipSketch(projectName);
  const res = context.response;
  res.body = result;
  makeResult(context);
  var costTime = (new Date().getTime() - startTime) / 1000;
  logger.debug(
    '[edit.js-combineImages]下载和解压缩图片完毕，用时' + costTime + '秒',
  );
}

//获取要使用的字体及安装字体
export async function getFonts(context: Context) {
  const { request } = context;
  const { url: url } = request.body;
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init({});
  let result = await imgCombineMac.getFonts(url);
  const res = context.response;
  res.body = result;
  makeResult(context);
}

export async function makeImg(context: Context) {
  // context.body = '123123';
  const { request } = context;
  const { param } = request.body;
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init({});
  const result = await imgCombineMac.makeImg(param);
  result.path = getHost(context) + '/imgData?path=' + result.path;
  const res = context.response;
  // console.log(dslModel);
  res.body = result;
}

//预览图查看
export async function preview(context: Context) {
  try {
    util.storeLoginData(context);
    logger = qlog.getInstance(store.getAll());
    // context.body = '1231234';
    const { request } = context;
    const param = request.body;
    const imgCombineMac = new ImgCombineMac();
    imgCombineMac.init({});

    let projectName = param.sketchPath.substring(
      param.sketchPath.lastIndexOf('/') + 1,
      param.sketchPath.lastIndexOf('.sketch'),
    );
    param.projectName = projectName;

    let startTime = new Date().getTime();
    logger.debug('[edit.js-combineImages]开始生成1张预览图');

    const result = await imgCombineMac.preview(param);
    var costTime = (new Date().getTime() - startTime) / 1000;
    logger.debug(
      '[edit.js-combineImages]生成预览图完毕，用时' + costTime + '秒',
    );
    result.path = getHost(context) + '/imgData?path=' + result.path;
    // throw 'error2';
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

export async function previewV2(context: Context) {
  await preview(context);
  makeResult(context);
}

export async function makeImgsByUpdateSketch(context: Context) {
  const { request } = context;
  const param = request.body;
  let sketchPath = param.sketchPath;
  param.projectName = sketchPath.substring(
    sketchPath.lastIndexOf('/') + 1,
    sketchPath.lastIndexOf('.sketch'),
  );
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init(param);
  const result = await imgCombineMac.makeImgsByUpdateSketch(param);
  result.path = getHost(context) + '/imgData?path=' + result.path;
  // const res = context.response;
  // res.body = result;
  return result;
}

export async function getImgData(context: Context) {
  try {
    if (typeof logger == 'undefined') {
      logger = qlog.getInstance(store.getAll());
    }
    let { path } = context.request.query; // 提取参数
    const res = await readImg(path);
    // res 为 Buffer流
    if (res) {
      context.type = 'png';
      context.body = res;
    }
  } catch (e) {
    context.type = 'png';
    context.body = '';
    logger.warn(e);
  }

  // 用fs处理流
  function readImg(path: string) {
    try {
      // 创建可读流
      let data: any = [];
      return new Promise((res, rej) => {
        var stat = fs.statSync(`./data/complie/${path}`);
        if (!stat.isDirectory()) {
          const readerStream = fs.createReadStream(`./data/complie/${path}`);
          readerStream.on('data', function(chunk: any) {
            data.push(chunk);
          });
          readerStream.on('end', function() {
            const finalData = Buffer.concat(data); // 合并Buffer
            res(finalData);
          });
        } else {
          res(null);
        }
      });
    } catch (e) {
      logger.warn(e);
      return new Promise((res, rej) => {
        res(null);
      });
    }
  }
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
    let startTime = new Date().getTime();
    logger.debug('[edit.js-combineImages]开始生成' + imgList.length + '张图片');
    util.storeLoginData(context);

    logger = qlog.getInstance(store.getAll());

    if (!existsSync('./data/upload_file/' + projectName + '.sketch')) {
      //下载sketch
      await downloadSketch(context);
    }

    //绘图
    let result = await makeImgsByUpdateSketch(context);

    var costTime = (new Date().getTime() - startTime) / 1000;
    logger.debug(
      '[edit.js-combineImages]生成' +
        result.length +
        '张图片完毕，用时' +
        costTime +
        '秒',
    );

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

export async function generateV2(context: Context) {
  if (typeof logger == 'undefined') {
    logger = qlog.getInstance(store.getAll());
  }
  await generate(context);
  makeResult(context);
}
