const { serialize, walkin } = require('../../utils');
const md5 = require('md5');
//获取重复
let getDuplicateImage = images => {
  let imageList = [...images];
  // for (var x = 0; x < imageList.length; x++) {
  //     if (!imageList[x]._imageChildren) {
  //         imageList.splice(x, 1);
  //         x--;
  //     }
  // }
  let imgs = [];
  let imgsData = {};
  //获取绘图数据
  let getDrawDataFromNode = imgNode => {
    data = '';
    let count = node => {
      //尺寸纬度
      data += node.frame.width;
      data += node.frame.height;
      //points 如果有就提取出来
      if (node.layers) {
        for (var i = 0; i < node.layers.length; i++) {
          count(node.layers[i]);
        }
      } else if (node.styles) {
        data += JSON.stringify(node.styles).toString();
      } else if (node._class == 'bitmap') {
        data += JSON.stringify(node.image).toString();
      } else {
        node.points &&
          (function() {
            data += JSON.stringify(node.points).toString();
          })();
      }
    };
    count(imgNode);
    if (imgNode.style.fills) {
      data += JSON.stringify(imgNode.style.fills).toString();
    }
    if (imgNode.style.borders) {
      data += JSON.stringify(imgNode.style.borders).toString();
    }
    return data;
  };
  // 获取绘图基础数据
  let getDrawData = item => {
    //item代表一张合并图
    //drawData表示绘图数据
    let drawData;
    let _imageChildren = item._imageChildren;
    if (!Array.isArray(_imageChildren) || !_imageChildren.length) {
      let node = item._origin;
      drawData += getDrawDataFromNode(node);
      return drawData;
    }
    for (let i = 0; i < _imageChildren.length; i++) {
      let node = _imageChildren[i]._origin;
      if (node && Object.keys(node).length)
        drawData += getDrawDataFromNode(node);
    }
    return drawData;
  };
  //重复的
  let isDuplicate = data => {
    let r = false;
    for (let y = 0; y < imgs.length; y++) {
      if (imgs[y].data == data) {
        if (imgs[y] && imgs[y]['id']) {
          r = imgs[y]['id'];
        }
        break;
      }
    }
    return r;
  };
  for (let i = 0; i < imageList.length; i++) {
    //获取绘图数据
    let data = getDrawData(imageList[i]);
    //判断
    let r = isDuplicate(data);
    if (r) {
      //重复
      imgs.push({
        id: imageList[i]['id'],
        replaceId: r,
        data: data,
      });
    } else {
      //不重复
      imgs.push({
        id: imageList[i]['id'],
        replaceId: null,
        data: data,
      });
    }
  }
  for (let z = 0; z < imgs.length; z++) {
    delete imgs[z]['data'];
    if (imgs[z].replaceId == null) {
      imgs.splice(z, 1);
      z--;
    }
  }
  return imgs;
};

function replacePath(images) {
  try {
    const imageList = [...images];
    let list = getDuplicateImage(imageList);
    list.forEach(({ id, replaceId }) => {
      let [index, masterIndex] = [
        imageList.findIndex(node => node.id === id),
        imageList.findIndex(node => node.id === replaceId),
      ];
      let [node, masterNode] = [imageList[index], imageList[masterIndex]];

      console.log(node.path, '被', replaceId, '替换');
      node.path = masterNode.path;
      imageList.splice(index, 1);
    });
  } catch (error) {
    console.error('图片去重报错！');
  }
}
function hashPath(imageList, outputPath = '') {
  imageList.forEach(n => {
    const id = md5(n.id);
    n.path = `${outputPath}${id.slice(0, 8)}.png`;
  });
}
function process(designDom, outputPath) {
  let nodes = serialize(designDom);
  let imageList = nodes.filter(node => node.type === 'QImage');
  replacePath(imageList);
  hashPath(imageList, outputPath);
}
module.exports = {
  process,
};
