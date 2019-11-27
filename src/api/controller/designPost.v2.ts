import { Context } from 'koa';
import DesignJson from '../../core/designjson';
import path from 'path';
import fs from 'fs';
const archiver = require('archiver');
const download = require('download-file');
const unzip = require('unzip');
const JSON_FILE_NAME = 'handPagesData.json';
const rimraf = require('rimraf');

const TEMP_DIRECTORY = path.resolve(__dirname, '../../../.temp/');
async function init(context: Context) {
  const { response: res, request: req } = context;
  const { fileType, data } = req.body;
  let initData: any = {};
  let responseData: ResponseData = new ResponseData();
  if (fileType === 'sketch') {
    const fileName = Date.now().toString();
    try {
      cleanTemptDir(+fileName);
      await downloadFile(data.pagesPath, fileName, TEMP_DIRECTORY);
      const pages = await unzipFile(fileName, TEMP_DIRECTORY);
      deleteZipFile(fileName, TEMP_DIRECTORY);
      data.pages = pages;
      initData = DesignJson.init(fileType, data);
      writeData(initData.data, fileName, TEMP_DIRECTORY);
      initData.data = {
        dataToken: fileName,
      };
      responseData.data = initData;
    } catch (error) {
      console.error(error);
      responseData.state = 0;
      responseData.msg = error.toString();
    }
  }
  res.body = responseData;
}
async function parse(context: Context) {
  const { response: res, request: req } = context;
  let { condition, artboardId, data: option, fileType } = req.body;
  let parseData: any = {};
  let responseData: ResponseData = new ResponseData();
  try {
    // sketch特殊处理
    const dataPath = `${TEMP_DIRECTORY}/${option.dataToken}/${
      option.dataToken
    }.json`;
    if (!fs.existsSync(dataPath)) {
      responseData.state = 2;
      responseData.msg = '找不到文件';
    } else {
      const jsonData = require(dataPath);
      parseData = parseNode(
        { condition, artboardId, fileType, jsonData },
        option,
      );
      responseData.data = parseData;
    }
  } catch (error) {
    console.error(error);
    responseData.state = 0;
    responseData.msg = error.toString();
  }
  res.body = responseData;
}

function parseNode(
  { condition = 0, artboardId = '', fileType = 'sketch', jsonData = null },
  option: any,
) {
  switch (condition) {
    case 0: {
      let { aiData, font: fontData, isPreedit, combineLayers } = option;
      const data = Object.assign(jsonData, {
        aiData,
        fontData,
        isPreedit,
        combineLayers,
      });
      return DesignJson.parse(artboardId, fileType, data);
    }
    case 1: {
      let { font: fontData } = option;
      const data = Object.assign(jsonData, {
        fontData,
      });
      return DesignJson.pureParse(artboardId, fileType, data);
    }
    case 2: {
      let { idList } = option;
      return DesignJson.localParse(artboardId, fileType, idList, jsonData);
    }
  }
}

function writeData(data: any, filename: string, directory: string) {
  try {
    const res = JSON.stringify(data);
    fs.writeFileSync(`${directory}/${filename}/${filename}.json`, res);
    console.log('写入处理数据成功');
  } catch (err) {
    throw new Error('写入处理数据失败');
  }
}

function cleanTemptDir(
  currentTime: number,
  expired: number = 24 * 3600 * 1000,
) {
  fs.readdir(TEMP_DIRECTORY, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(filepath => {
      const fileTime = +filepath;
      if (fileTime && currentTime - fileTime > expired) {
        rimraf(filepath, function() {
          console.log('删除过期目录：', filepath);
        });
      }
    });
  });
}

async function downloadFile(url: string, filename: string, directory: string) {
  return new Promise((resolve, reject) => {
    download(
      url,
      {
        directory,
        filename: filename + '.zip',
      },
      function(err: Error) {
        if (err) {
          // console.error('下载源文件失败');
          reject(new Error('下载源文件失败'));
        }
        const result = {
          message: 'ok',
        };
        console.log('下载源文件成功');
        resolve(result);
      },
    );
  });
}

async function unzipFile(fileName: string, directory: string) {
  const fullName = directory + '/' + fileName;
  return new Promise((resolve, reject) => {
    var unzipExtractor = unzip.Extract({
      path: fullName,
    });
    unzipExtractor.on('error', function(err: Error) {
      // console.log('解压源文件失败');
      reject(new Error('解压源文件失败'));
    });
    unzipExtractor.on('close', function() {
      // console.log(fs.existsSync(path.join(zipPath, 'pages')))
      const res = require(`${fullName}/${JSON_FILE_NAME}`);
      // fs.readFileSync(fullName + '/handPages.json').toString();
      // const res = JSON.parse(str);
      console.log('解压源文件成功');
      resolve(res);
    });

    fs.createReadStream(fullName + '.zip').pipe(unzipExtractor);
  });
}
function deleteZipFile(fileName: string, directory: string) {
  const fullName = directory + '/' + fileName + '.zip';
  fs.unlink(fullName, () => {});
}
class ResponseData {
  state: number = 1;
  data: any = null;
  msg: string = '';
}
export default {
  init,
  parse,
};
