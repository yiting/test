const md5 = require('md5');
const { serialize } = require('../utils');
const SketchPostProcessor = require('./sketch/SketchPostProcessor');
function process(designDom, options = {}) {
  let nodes = serialize(designDom);
  let imageList = nodes.filter(node => node.type === 'QImage');
  hashPath(imageList, options.outputPath);
}
function hashPath(imageList, outputPath = '') {
  imageList.forEach(n => {
    const id = md5(n.id);
    n.path = `${outputPath}${id.slice(0, 8)}.png`;
    hashPath(n._imageChildren, outputPath);
  });
}
module.exports = {
  sketch: SketchPostProcessor,
  process,
};
