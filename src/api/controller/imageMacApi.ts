import { Context } from 'koa';
// import dslModel from '../../core/dsl_service/index';
import ImgCombineMac from '../../core/designimage/img_combine_mac';
import qlog from '../../core/log/qlog';
const logger = qlog.getInstance(qlog.moduleData.img);
var Url = require('url');
var fs = require('fs');

function getHost(context: Context) {
  return context.origin;
}

export async function downloadSketch(context: Context) {
  const { request } = context;
  const { sketchPath: url } = request.body;
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init({});
  let result = await imgCombineMac.downloadSketch(url);
  // 解压缩
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

export async function makeImgByUpdateSketch(context: Context) {
  const { request } = context;
  const { param } = request.body;
  const imgCombineMac = new ImgCombineMac();
  imgCombineMac.init(param);
  const result = await imgCombineMac.makeImgByUpdateSketch(param);
  result.path = getHost(context) + '/imgData?path=' + result.path;
  const res = context.response;
  res.body = result;
}

export async function getImgData(context: Context) {
  try {
    let { path } = context.request.query; // 提取参数
    const res = await readImg(path);
    // res 为 Buffer流
    if (res) {
      context.type = 'jpg';
      context.body = res;
    }
  } catch (e) {
    logger.warn(e);
  }

  // 用fs处理流
  function readImg(path: string) {
    try {
      // 创建可读流
      let data: any = [];
      return new Promise((res, rej) => {
        if (fs.existsSync(`./data/complie/${path}`)) {
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
    }
  }
}
