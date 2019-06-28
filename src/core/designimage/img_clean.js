// const qlog = require("../log/qlog");

const qlog = require('../log/qlog');
const store = require('./helper/store');
let logger = qlog.getInstance(store.default.getAll());
var fs = require('fs');

function clean(domList, styleArray) {
  logger = qlog.getInstance(store.default.getAll());
  let clearnList = [];
  // logger.debug( domList );
  let getshadowImg = (item, isArray) => {
    if (isArray) {
      item.forEach((itemz, index) => {
        if (itemz._imageChildren) {
          getshadowImg(itemz._imageChildren, true);
        }
        if (itemz.isMask) {
          clearnList.push({ type: 'mask', id: item.id });
        }
        if (itemz.style) {
          styleArray.forEach(items => {
            if (itemz.style[items]) {
              // console.log(items)
              clearnList.push({
                type: items,
                id: itemz.do_objectID,
                value: itemz.style[items],
              });
            }
          });
        }
        if (itemz.layers && itemz.layers.length) {
          getshadowImg(itemz.layers, true);
        }
      });
    } else {
      if (item._imageChildren) {
        getshadowImg(item._imageChildren);
      }
      if (item.isMask) {
        clearnList.push({ type: 'mask', id: item.id });
      }
      if (item.style) {
        styleArray.forEach(items => {
          if (item.style[items]) {
            // console.log(items)
            clearnList.push({
              type: items,
              id: item.id,
              value: item.style[items],
            });
          }
        });
      }
      if (item.layers && item.layers.length) {
        getshadowImg(item.layers, true);
      }
    }
  };
  getshadowImg(domList);
  // console.log(clearnList)
  return clearnList;
}
function clearJSON(tmpJSONData, idList, styleArray) {
  //判断是否有阴影
  let checkShadows = json => {
    let tmp = {
      group: true,
      artboard: true,
    };
    if (json.style && json.style.shadows && checkGroup(json)) {
      return true;
    }
    return false;
  };
  //判断是否文件夹（会影响后代阴影)
  let checkGroup = json => {
    let tmp = {
      group: true,
      artboard: true,
    };
    return tmp[json._class];
  };
  //根据ID来遍历，干掉对应ID下的style
  let doId = (JSONx, idList, styleArray, isExitShadows) => {
    if (JSONx.layers && JSONx.layers.length) {
      JSONx.layers.forEach((tmp, i) => {
        doId(tmp, idList, styleArray, isExitShadows ? true : checkShadows(tmp));
      });
    }
    if (isExitShadows && checkGroup(JSONx)) {
      delete JSONx.style['shadows'];
    }
    if (JSONx.style) {
      idList.forEach((items, indexs) => {
        if (JSONx.do_objectID == items.id) {
          logger.debug('[去除特定属性]找到一个' + JSONx.do_objectID);
          // JSONx.style[style] = null
          // delete JSONx.style[style]
          if (items.type == 'shadows') {
            logger.debug('[去除特定属性]进入一个纯' + items.id);
            if (!JSONx.style['shadows']) {
              JSONx.style['shadows'] = items.value;
            }
          }
          styleArray.forEach(sk => {
            if (JSONx.style[sk]) {
              logger.debug('[去除特定属性]删除一个' + sk);
              delete JSONx.style[sk];
            }
          });
        }
      });
    }
  };

  doId(tmpJSONData, idList, styleArray, checkShadows(tmpJSONData));
}
function cleanFile(dir, idList, styleArray) {
  return new Promise(resolve => {
    //获取文件夹内的所有文件，清楚shadow属性
    if (fs.existsSync(dir)) {
      var files = fs.readdirSync(dir);
      files.forEach(item => {
        var filePath = dir + '/' + item;
        fs.readFile(filePath, function(err, data) {
          if (err) {
            console.error(err);
          }
          //把数据读出来,然后进行修改
          let tmpData = data.toString();
          let tmpJSONData;
          if (tmpData) {
            try {
              tmpJSONData = JSON.parse(tmpData);
            } catch (e) {
              console.log('解析json出问题');
              tmpJSONData = {};
            }
            var k = 0;
            //判断是否有阴影
            let checkShadows = json => {
              let tmp = {
                group: true,
                artboard: true,
              };
              if (json.style && json.style.shadows && checkGroup(json)) {
                return true;
              }
              return false;
            };
            //判断是否文件夹（会影响后代阴影)
            let checkGroup = json => {
              let tmp = {
                group: true,
                artboard: true,
              };
              return tmp[json._class];
            };
            //根据ID来遍历，干掉对应ID下的style
            let doId = (JSONx, idList, styleArray, isExitShadows) => {
              if (JSONx.layers && JSONx.layers.length) {
                k++;
                JSONx.layers.forEach((tmp, i) => {
                  doId(
                    tmp,
                    idList,
                    styleArray,
                    isExitShadows ? true : checkShadows(tmp),
                  );
                });
              }
              if (isExitShadows && checkGroup(JSONx)) {
                delete JSONx.style['shadows'];
              }
              if (JSONx.style) {
                idList.forEach((items, indexs) => {
                  if (JSONx.do_objectID == items.id) {
                    console.log('找到一个' + JSONx.do_objectID);
                    // JSONx.style[style] = null
                    // delete JSONx.style[style]
                    if (items.type == 'shadows') {
                      if (!JSONx.style['shadows']) {
                        JSONx.style['shadows'] = items.value;
                      }
                    }
                    styleArray.forEach(sk => {
                      if (JSONx.style[sk]) {
                        console.log('删除一个' + sk);
                        delete JSONx.style[sk];
                      }
                    });
                  }
                });
              }
            };

            doId(tmpJSONData, idList, styleArray, checkShadows(tmpJSONData));
          }
          var str = JSON.stringify(tmpJSONData);
          //console.log(str);
          fs.writeFile(filePath, str, function(err) {
            if (err) {
              console.error(err);
            }
            console.log(filePath + '--------------------修改成功');
            resolve('ok');
          });
        });
        k = 0;
      });
    }
  });
}
module.exports = {
  cleanImg: clean,
  cleanFile: cleanFile,
  clearJSON: clearJSON,
};
