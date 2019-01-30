/**
 * 处理AI数据结构
 * @param {*} AIData
 */
const fs = require("fs");
let AIServiceUrl = "http://10.64.70.40:8080";
let AIDataHandle = function (AIData) {
  let arr = [];
  try {
    AIData = AIData.trim()
      .replace(/"/g, "")
      .split(/\s/);
    let n = 0;
    for (let i in AIData) {
      let AIOne = AIData[i];
      let AIOneArr = AIOne.split(",");
      let AIOneArrFirst = AIOneArr[0].split(":");
      let AIOneArrSec = AIOneArr[1].split(":");
      let AIOneArrThird = AIOneArr[2].split(":");
      let AIOneArrFourth = AIOneArr[3].split(":");
      let AIOneArrFifth = AIOneArr[4].split(":");
      let AIOneArrSixth = AIOneArr[5].split(":");
      //第一个元素
      let o = {
        id: "ai-" + n++,
        det: AIOneArrFirst[1],
        name: AIOneArrSec[0],
        rate: AIOneArrSec[1],
        width: AIOneArrThird[1],
        height: AIOneArrFourth[1],
        x: AIOneArrFifth[1],
        y: AIOneArrSixth[1]
      };
      arr.push(o);
    }
    //console.log(arr);
  } catch (e) {
    //未匹配到模型结果
    arr = ["none"];
  }
  return arr;
};

/**
 * 复制文件
 * @param {*} srcPath
 * @param {*} tarPath
 * @param {*} cb
 */

let copyFile = function (srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on("error", function (err) {
    if (err) {
      console.log("read error", srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on("error", function (err) {
    if (err) {
      console.log("write error", tarPath);
    }
    cb && cb(err);
  });
  ws.on("close", function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
};
/**
 * 复制文件夹目录
 * @param {*} srcDir
 * @param {*} tarDir
 * @param {*} cb
 */
let copyFolder = function (srcDir, tarDir, cb) {
  if (!fs.existsSync(tarDir)) {
    fs.mkdirSync(tarDir);
  }

  fs.readdir(srcDir, function (err, files) {
    var count = 0;
    var checkEnd = function () {
      ++count == files.length && cb && cb();
    };

    if (err) {
      checkEnd();
      return;
    }

    files.forEach(function (file) {
      //var srcPath = path.join(srcDir, file);
      //var tarPath = path.join(tarDir, file);

      var srcPath = srcDir + "/" + file;
      var tarPath = tarDir + "/" + file;

      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log("mkdir", tarPath);
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(err);
              return;
            }

            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
};
/**
 * 删除文件夹
 * @param {*} path
 */
let deleteFolder = function (path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
};
/**
 * 是否在一周内
 * @param {*} date 
 */
let isWeek = function (date) {
  date = date.split("");
  date.splice(4, 0, "-");
  date.splice(7, 0, "-");
  date.splice(10, 0, " ");
  date.splice(13, 0, ":");
  date.splice(16, 0, ":");
  date = date.join("");
  let flag = Math.abs(new Date().getTime() - new Date(date).getTime()) < 7 * 24 * 3600 * 1000 //时间差和一周时间的比较
  return flag;
}

module.exports = {
  AIServiceUrl,
  AIDataHandle,
  copyFolder,
  deleteFolder,
  isWeek
};