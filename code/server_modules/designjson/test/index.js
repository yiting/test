const parse = require('../designjson_parser_sketch').parse;
const optimize = require('../designjson_optimize');
const inputList = [require('./sketch/pages1/56697BCE-3C8D-4837-A2AF-42136DC0FB02.json'),require('./sketch/pages1/FD893550-FF2B-40BA-9EC8-7C6D3C78F46D.json')];
const _document = parse('25F2167C-0904-4486-B3BC-8D36281D2180',inputList);
optimize(_document);
_document.toJson(); // 输出design-dom
// const imageNodeList = _document.getImage(); // 输出导出图片列表




// const parse = require('../designjson_parser_sketch').parse;
// const optimize = require('../designjson_optimize');
// const inputList = [require('./sketch/pages/7A4A3C7D-C873-4508-9B20-FCDF15FD1756.json')];
// const _document = parse('B1730E33-232F-446B-B9A0-334E8B99D923',inputList);
// optimize(_document);
// _document.getImage()
// // _document.toJson();
