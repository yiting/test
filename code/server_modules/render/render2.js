
const Fs = require('fs');

let htmlBegin = '<html data-use-rem="750"><head><style>* {margin:0;padding:0} body {font-size:0.24rem;color:#fff}</style><link rel="stylesheet" href="./index.css"></head><body><script src="./rem.js"></script>';
let htmlEnd = '</body></html>';
module.exports = function (htmlStr, cssStr) {
    // 写出文件
    htmlStr = htmlBegin + htmlStr + htmlEnd;

    let saveHtmlPath = './index.html';
    let saveCssPath = './index.css';

    Fs.writeFile(saveHtmlPath, htmlStr, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('写html成功');
        }
    });

    Fs.writeFile(saveCssPath, cssStr, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('写css成功');
        }
    });
}