import { Context } from 'koa';
import DesignJson from '../../core/designjson';
import path from 'path';
import fs from 'fs';
const archiver = require('archiver');
const download = require('download-file');
const unzip = require('unzip');
const JSON_FILE_NAME = 'handPagesData.json';
// const ip = require('ip');
const TEMP_DIRECTORY = path.resolve(__dirname, '../../../.temp/');
export async function init(context: Context) {
  const { response: res, request: req } = context;
  const { fileType, data } = req.body;
  let initData: any = {};
  if (fileType === 'sketch') {
    const fileName = Date.now().toString();
    try {
      await downloadFile(data.pagesPath, fileName, TEMP_DIRECTORY);
      const pages = await unzipFile(fileName, TEMP_DIRECTORY);
      deleteZipFile(fileName, TEMP_DIRECTORY);
      data.pages = pages;
      initData = DesignJson.init(fileType, data);
      writeData(initData.data, fileName, TEMP_DIRECTORY);
      initData.data = {
        dataToken: fileName,
      };
    } catch (error) {
      console.error(error);
    }
  }
  res.body = initData;
}
export async function parse(context: Context) {
  const { response: res, request: req } = context;
  let { artboardId, data, fileType } = req.body;
  let parseData: any = {};
  try {
    // sketch特殊处理
    data = require(`${TEMP_DIRECTORY}/${data.dataToken}/${
      data.dataToken
    }.json`);
    parseData = DesignJson.parse(artboardId, data);
  } catch (error) {
    console.error(error);
  }
  res.body = parseData;
}
function writeData(data: any, filename: string, directory: string) {
  try {
    const res = JSON.stringify(data);
    fs.writeFileSync(`${directory}/${filename}/${filename}.json`, res);
    console.log('写入处理数据成功');
  } catch (err) {
    console.error('写入处理数据失败');
  }
}

async function zipData(data: any, destZip: string) {
  return new Promise((resolve, reject) => {
    let str: string = '';
    try {
      str = JSON.stringify(data);
    } catch (error) {
      reject(error);
    }
    const output = fs.createWriteStream(destZip);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', function() {
      resolve();
    });
    archive.on('error', function(error: Error) {
      reject(error);
    });
    // zip
    archive.pipe(output);
    archive.append(str, { name: JSON_FILE_NAME });
    archive.finalize();
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
          console.error('下载源文件失败');
          reject(err);
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
      console.log('解压源文件失败');
      throw err;
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
