/**
 * 处理AI数据结构
 * @param {*} AIData
 */
const fs = require("fs");
let AIServiceUrl = "http://10.65.90.45:8080";
let AIDataHandle = function(AIData) {
  let arr = [];
  try {
    AIData = AIData.trim().split(/\s/);
    let n = 0;
    for (let i in AIData) {
      let AIOne = AIData[i];
      let AIOneArr = AIOne.split(";");
      let AIOneArrFirst = AIOneArr[0].split(":");
      let AIOneArrSec = AIOneArr[1].split(":");
      let AIOneArrThird = AIOneArr[2].split(":");
      let AIOneArrFourth = AIOneArr[3].split(":");
      let AIOneArrFifth = AIOneArr[4].split(":");
      //第一个元素
      let o = {
        id: "ai-" + n++,
        name: AIOneArrFirst[0],
        rate: AIOneArrFirst[1],
        width: AIOneArrSec[1],
        height: AIOneArrThird[1],
        x: AIOneArrFourth[1],
        y: AIOneArrFifth[1]
      };
      arr.push(o);
    }
    console.log(arr);
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

let copyFile = function(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on("error", function(err) {
    if (err) {
      console.log("read error", srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on("error", function(err) {
    if (err) {
      console.log("write error", tarPath);
    }
    cb && cb(err);
  });
  ws.on("close", function(ex) {
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
let copyFolder = function(srcDir, tarDir, cb) {
  if (!fs.existsSync(tarDir)) {
    fs.mkdirSync(tarDir);
  }

  fs.readdir(srcDir, function(err, files) {
    var count = 0;
    var checkEnd = function() {
      ++count == files.length && cb && cb();
    };

    if (err) {
      checkEnd();
      return;
    }

    files.forEach(function(file) {
      //var srcPath = path.join(srcDir, file);
      //var tarPath = path.join(tarDir, file);

      var srcPath = srcDir + "/" + file;
      var tarPath = tarDir + "/" + file;

      fs.stat(srcPath, function(err, stats) {
        if (stats.isDirectory()) {
          console.log("mkdir", tarPath);
          fs.mkdir(tarPath, function(err) {
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
let deleteFolder = function(path) {
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
module.exports = {
  AIServiceUrl,
  AIDataHandle,
  copyFolder,
  deleteFolder
};
