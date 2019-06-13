const BIN =
  '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
const PAR = 'list layers';
const { execSync } = require('child_process');
function getRectInfo(filePath) {
  try {
    let res = execSync(`${BIN} ${PAR} ${filePath}`).toString();
    if (!res) throw 'sketchtool调用结果为空';
    let frameInfo = processRectInfo(res);
    console.log(frameInfo);
    return frameInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function processRectInfo(str) {
  let info = {};
  try {
    info = JSON.parse(str);
  } catch (error) {
    console.error(error);
  }
  let { pages } = info;
  if (!Array.isArray(pages) || !pages.length) return null;
  let obj = {};
  pages.forEach(page => {
    page.layers.forEach(rootLayer => {
      let rootFrame = rootLayer.trimmed;
      console.log(rootFrame);
      walkin(rootLayer, rootFrame, (id, frame) => {
        obj[id] = frame;
      });
    });
  });
  return obj;
}
function walkin(layer, rootFrame, callback) {
  let { x, y, width, height } = layer.trimmed;
  let frame = {
    name: layer.name,
    abX: x - rootFrame.x,
    abY: y - rootFrame.y,
    width,
    height,
  };
  callback(layer.id, frame);
  if (layer.layers.length) {
    layer.layers.forEach(childLayer => {
      walkin(childLayer, rootFrame, callback);
    });
  }
}
// getRectInfo('/Users/yone/Documents/视觉稿/报错/20190328113807_九创造101.sketch')
// .then(res => {
//     console.log(res);
// })
module.exports = getRectInfo;
