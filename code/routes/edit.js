/*系统包、工具模块*/
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer')
const router = express.Router()
//依赖文件下载包
const archiver = require('archiver');
let Utils = require('../server_modules/util/utils');
//模板类
let Template = require('../server_modules/util/template');
//导出类
let Export = require('../server_modules/util/export');
//1.引入parser模块
let Parser = require('../server_modules/designjson/designjson_parser_sketch').parse;
let Optimize = require('../server_modules/designjson/designjson_optimize');
//2.引入dsl模块
let DSL = require('../server_modules/dsl/dsl');
//3.引入图片模块
let ImageCombine = require("../server_modules/designimage/img_combine");
//声明页面数据
let pageArtboardsData = [], projectUUID, projectName, taskPromise;
/*业务逻辑*/
//渲染页面路由:初始化编辑查看页面,填充页面数据
router.get('/', function (req, res, next) {
    //初始化一次，清空数据
    pageArtboardsData = [];
    /*express获取参数有三种方法：
     Checks route params (req.params), ex: /user/:id
     Checks query string params (req.query), ex: ?id=12
     Checks urlencoded body params (req.body), ex: id=*/
    projectUUID = req.query.id;
    projectName = req.query.name;
    //初始化请求，并渲染:先获得数据；再将数据传到页面上
    getPagesAndArtBoards(projectName, function (pageData) {
        res.render("edit", {data: JSON.stringify(pageData)});
    })
});

//根据pageid、artboardID请求页面:调用项目生成
router.post('/getPageById', function (req, res, next) {
    //console.log("传到后台的pid为:" )
    let pageId = req.body.pageId;
    let artBoardId = req.body.artboardId;
    //console.log("传到后台的pid为:" + artBoardId)
    let resultURL = {
        //本机ip
        url: "http://localhost:8080/result/" + projectUUID + "/" + artBoardId + ".html"
        //在线url
        //url: "http://111.231.239.66:8080/result/" + projectUUID + "/" + artBoardId + ".html"
    }
    //2018-08-25:将pages下面所有json读取出来给到yone。根据artBoardID，[json数组]获取当前artBoard对应的degisnDom，然后调用俊标模块，获取对应的html和css
    let currentPagesJsonsArr = [];
    let pagesJsonDirectory = './data/unzip_file/' + projectName + "/pages";
    if (fs.existsSync(pagesJsonDirectory)) {
        fs.readdir(pagesJsonDirectory, function (err, files) {
            let pagesFileLen = files.length;
            for (let i = 0; i < pagesFileLen; i++) {
                let pageOneFilePath = pagesJsonDirectory + "/" + files[i];
                let pageOneJson = JSON.parse(fs.readFileSync(pageOneFilePath));
                currentPagesJsonsArr.push(pageOneJson)
            }
            try {
                //1.根据当前选中的artBoardId获取当前的designDom
                let currentDesignDom = Parser(artBoardId, currentPagesJsonsArr);
                Optimize(currentDesignDom);
                //获取当前的designdom对应的json
                let designJson = currentDesignDom.toJson();
                //获取要合并的图片列表
                let imageList = currentDesignDom.getImage();
                // //2.给design dom生成html方法
                // jsonToHtmlCss(artBoardId, designJson, function () {
                //     res.send(JSON.stringify(resultURL));
                // });
                //1.创建项目生成文件夹目录
                let fileFolder = './public/result/' + projectUUID;
                //1.创建目录
                Utils.isFileExist(fileFolder, function (existFlag) {
                    //文件不存在的话
                    console.log('检测文件是否存在标识:' + existFlag)
                    if (!existFlag) {
                        fs.mkdir(fileFolder, function (err) {
                            if (err) {
                                console.log('创建目录失败')
                            } else {
                                console.log('创建目录成功')
                            }
                        })
                    } else {
                        console.log('目录已存在')
                    }

                    //2.获取image图片文件
                    ImageCombine.init({
                        "inputDir": "./data/unzip_file/" + projectName + "/",//源图片------'./unzip_file/' + projectName + "/images";
                        "outputDir": "./public/result/" + projectUUID + "/",//图片导出路径---let exportPath = './public/result/' + projectUUID
                        "pageJson": imageList
                    });

                    //异步任务处理图片导出
                    taskPromise = new Promise((resolve, reject) => {
                        let combineImages = async (callback) => {
                            for (let i = 0, ilen = imageList.length; i < ilen; i++) {
                                let newNode = await ImageCombine.combineNode(imageList[i]);
                                console.log("生成目标图片" + i + "：" + newNode.path);
                            }
                            ImageCombine.deleteTmpFiles();
                            callback();
                        }
                        combineImages(function () {
                            resolve('success');
                        });

                    });
                    //3.生成图片后，再生成html和css
                    try {
                        taskPromise.then((result) => {
                            console.log('接受resolved的结果');
                            //2.给design dom生成html方法
                            jsonToHtmlCss(artBoardId, designJson, function () {
                                res.send(JSON.stringify(resultURL));
                            });

                            console.log(result);
                        }, (err) => {
                            console.log('捕获错误的结果');
                            console.log(err);
                        });
                    } catch (e) {
                        console.log(e)
                    }
                })
            } catch (e) {
                console.log("报错，不解析：" + e)
                res.send(e.toString());
            }
        });
    }
});


/**
 * 解析sketch pages数据基本信息---来源:meta.json
 * @param projectName
 * @param callback
 */
let getPagesAndArtBoards = function (projectName, callback) {
    fs.readFile('./data/unzip_file/' + projectName + '/meta.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        //console.log(data);
        let metaJson = JSON.parse(data);
        let pagesData = metaJson.pagesAndArtboards;
        //遍历map
        for (let pageProp in pagesData) {
            if (pagesData.hasOwnProperty(pageProp)) {
                let objOneKey = pageProp;
                let objOneValue = pagesData[pageProp];

                let pageOne = {
                    pageId: objOneKey,
                    pageName: objOneValue.name,
                    artBoards: []
                };
                let pageOneArtBoards = objOneValue.artboards;
                for (let artProp in pageOneArtBoards) {
                    if (pageOneArtBoards.hasOwnProperty(artProp)) {
                        let artOneKey = artProp;
                        let artOneValue = pageOneArtBoards[artProp];
                        let artOne = {
                            artboardId: artProp,
                            artboardName: artOneValue.name
                        }
                        pageOne.artBoards.push(artOne);
                    }
                }
                pageArtboardsData.push(pageOne);
            }
        }
        //将拼装的数据结构返回预览页面进行填充
        callback(pageArtboardsData)
    });
};


/**
 * 根据给到当前artBoardId对应designDom，调用DSL模块方法转为html和css
 * @param artBoardId
 * @param currentDesignDom
 * @param callback
 * @returns {boolean}
 */
let jsonToHtmlCss = function (artBoardId, currentDesignDom, callback) {
    //这里的testdata根据yone解析后的数据传入即可
    let h5Render = DSL.mobileHtml(currentDesignDom),
        html = h5Render.toHtml(),
        css = 'html{font-size:13.33333vw;}body{margin:0;}img{font-size:0}' + h5Render.toCss()
    //动态传入css文件名称:按照遍历序号来
    let cssHtmlfileName = artBoardId
    html = Template.html5(cssHtmlfileName) + html + Template.end()
    //console.log('css日志:' + css)
    //console.log('html日志:' + html)
    //这里的文件要以项目组织起来
    //生成文件导出对应路径
    let exportPath = './public/result/' + projectUUID
    //console.log('全路径:' + exportPath)
    // 导出html、css文件
    try {
        /*if (html) {
         Export.exportHtml(exportPath, cssHtmlfileName, html, function () {
         console.log('导出html成功')
         if (css) {
         Export.exportCss(exportPath, cssHtmlfileName, css, function () {
         console.log('导出css成功')
         exportFlag = true;
         callback()
         })
         }
         })
         }*/

        taskPromise.then((result) => {
            if (html) {
                Export.exportHtml(exportPath, cssHtmlfileName, html, function () {
                    console.log('导出html成功')
                })
            }
        }, (err) => {
            console.log("导出html错误:" + err);
        }).then((result) => {
            if (css) {
                Export.exportCss(exportPath, cssHtmlfileName, css, function () {
                    console.log('导出css成功')
                    callback()
                })
            }
        }, (err) => {
            console.log("导出css错误:" + err);
        });
    }
    catch (e) {
        console.log('导出文件出错！')
    }
}


/**
 * 文件下载模块
 */
//目前是根据已有生成的文件进行打包：如果没有生成：1.尽量全部生成后在下载 2.空闲时间：来进行默默写入文件到工程目录
router.post('/download', function (req, res, next) {
    //console.log("进入下载")
    let desZipPath = './data/download_file/' + projectUUID + ".zip";
    let srcPojectPath = './public/result/' + projectUUID;
    res.set({
        'Content-Type': 'application/octet-stream;charset=utf8', //告诉浏览器这是一个二进制文件
        "Content-Disposition": "attachment;filename=" + encodeURI(projectUUID)
    });
    Utils.zipFolder(desZipPath, srcPojectPath, function () {
        res.download(desZipPath);
    });
});


module.exports = router

