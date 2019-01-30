/**
 * node skCommon.js -p {sketch path} -m {run module}
 * 
 * -m: html ,jsonToHtmlCss
 *     img,combineImages
 */

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var unzip = require('unzip');
var args = minimist(process.argv.slice(2));
let Utils = require('./util/utils');
//1.引入parser模块
let Parser = require('./designjson/parser/designjson_parser_sketch').parse;
let Optimize = require('./designjson/optimize/designjson_optimize');
// 获取文件路径参数
if (!args.p) {
    throw ("illegal sketch path")
    return;
}
var skPath = args.p,
    artid = args.a,
    mod = {
        html: (!args.m) || /html/.test(args.m),
        img: (!args.m) || /img/.test(args.m),
        json: (!args.m) || /json/.test(args.m)
    },
    commonDir = path.dirname(skPath),
    basename = path.basename(skPath, '.sketch'),
    outputPath = path.join(commonDir, basename),
    zipPath = path.join(outputPath, 'zip'),
    imgPath = path.join(outputPath, 'img');

/**
 * 解压文件
 */
// 解压
function extract(callback) {
    try {
        fs.existsSync(outputPath) || fs.mkdirSync(outputPath);
        fs.existsSync(zipPath) || fs.mkdirSync(zipPath);
        fs.existsSync(imgPath) || fs.mkdirSync(imgPath);
        var unzipExtractor = unzip.Extract({
            path: zipPath
        });
        unzipExtractor.on('error', function (err) {
            throw err;
        });
        unzipExtractor.on('close', function () {
            // console.log(fs.existsSync(path.join(zipPath, 'pages')))
            callback && callback()
        });

        fs.createReadStream(skPath).pipe(unzipExtractor);
    } catch (e) {
        throw e;
    }
}
// 获取数据
function getData() {
    let artboards = [],
        pages = [];
    let pagesDir = path.join(zipPath, 'pages'),
        documentPath = path.join(zipPath, 'document.json');
    if (!fs.existsSync(pagesDir)) {
        throw 'dir "' + pagesDir + '" is not exist';
        return;
    }
    let files = fs.readdirSync(pagesDir),
        documentJson = fs.readFileSync(documentPath);
    for (let i = 0; i < files.length; i++) {
        let pageJSON = JSON.parse(
            fs.readFileSync(path.join(pagesDir, files[i]))
        );
        let artboard = pageJSON.layers.filter((p) => {
            return (p._class == 'artboard') && (!artid || artid == p.do_objectID);
        });
        pages.push(pageJSON);
        artboards = artboards.concat(artboard)
    };
    artboards.forEach((art) => {
        try {
            let fileName = art.do_objectID;
            let designDom = Parser(art.do_objectID, pages, 0, documentJson)["document"];
            Optimize(designDom);
            let designjson = designDom.toList();
            Utils.writeToFile(outputPath + '/tree-' + fileName + '.json', JSON.stringify(designjson), function () {});
        } catch (e) {
            console.log(e)
        }
    });
}

extract(() => {
    getData();
});