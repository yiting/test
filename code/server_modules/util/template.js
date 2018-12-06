// template.js 用于生成各模板相关字符串

// h5头
let htmlStart = function(cssName) {
  let str =
    "<!DOCTYPE html>" +
    '<html data-use-rem="750">' +
    "<head>" +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">' +
    "<title></title>" +
    '<link rel="stylesheet" href="css/' +
    cssName +
    '.css">' +
    '<script src="http://imgcache.qq.com/push/js/grid.js"></script>' +
    "</head>";
  str +=
    "<style>::-webkit-scrollbar {width: 0;height: 0;}::-webkit-scrollbar-thumb {background-color: rgba(0, 0, 0, 0.7);border-radius: 4px;}</style>";
  str += "<body>";

  return str;
};

let htmlEnd = function() {
  // let str = '<script src="https://coderjunb.github.io/Contrast/dist/contrast.js"></script>'
  //         + '<script>Contrast.setBg({src: "./images/bg.png"});</script>'
  //         + '</html>';
  let str = "</body></html>";

  return str;
};

module.exports = {
  htmlStart,
  htmlEnd
};
