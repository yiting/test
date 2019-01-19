const designjson = require('./test.json');

// 引入的模块包
const Common = require('../../code/server_modules/dsl2/dsl_common.js');
const Dsl = require('../../code/server_modules/dsl2/dsl.js');
const Render = require('../../code/server_modules/render/render.js');

let dslTree = Dsl.process(designjson, 750, 750, Common.TestLayout);
// let jsonData = dslTree.getRenderData();
// console.log(jsonData);
let render = Render.process(dslTree, Common.TestLayout);
let htmlStr = render.getTagString();
let cssStr = render.getStyleString();
const Path = require('path');

// 输出文件
render.outputFileWithPath(Path.join(__dirname, './output/index.html'), htmlStr);
render.outputFileWithPath(Path.join(__dirname, './output/index.css'), cssStr);