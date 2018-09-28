/**
 * Created by alltasxiao on 2018/8/23.
 */
$(document).ready(function () {
    initPage();
    operatePage();
});


let currentArtBoardUrl, currentPageId, currentPageName, currentArtboardId, artboardsUrlArr = [], urlIsGenerate = false;
let imgsPathArr = [], projectId;//存放生成的图片素材路径数组
let operatePage = function () {
    leftOperate();
    centerOperate();
    rightOperate();
};

//左侧面板操作
let leftOperate = function () {
    //跳转到主页
    $(".icon-logo").click(function () {
        window.location = "/";
    });
    //下垃框点击，显示当前page下拉框
    $(".pages-select").click(function () {
        $(".pages-list").show();
    });
    //页面下拉框选择后，隐藏前page下拉框
    $(".pages-list").on("click", ".pages-item", function (e) {
        e.stopPropagation();
        $(".pages-list").hide();
    });
    $(".pages-list").on("change", ".pages-item input", function () {
        //关闭图片查看器
        $(".magnify-modal").remove();
        let inputObj = $(this);
        //当前选中page页面的id，根据pageid，切换下面的数据,并请求第一个artBoard，合成html网页
        let itemObj = inputObj.parent();
        currentPageId = inputObj.data("id");
        $(".pages-list").hide();
        //根据pageid，切换对应的artBoard列表
        getArtBoardsByPageId(currentPageId, function () {
            //切换pages，成功填充artBoard list后，然后选中第一个节点的id
            currentArtboardId = $(".artboard-list .artboard:first").data("id");
        });
        //切换刷新对应的artBoards列表，且默认查询当前page的第一个artBoard页面
        getPageUrlById();
    });

    //根据选择artBoardId来加载对应的ardBoard页面
    $(".artboard-list").on("click", ".artboard", function () {
        //关闭图片查看器
        $(".magnify-modal").remove();
        let currentArtboard = $(this);
        currentArtboard.addClass("active").siblings().removeClass("active");
        //请求当前artBoardId对应的url
        currentPageId = $(".page-title").data("pid");
        currentArtboardId = currentArtboard.data("id");
        //根据artboardId获取对应的页面url，展示该页面
        getPageUrlById();
    });

    //根据url显示对应的二维码
    showQrCodeAndUrl();
    //下载当前编译项目zip文件
    downloadProject();
}

//中间面板操作
let centerOperate = function () {
    //切换编译模式：默认使用普通模式
    $('.compilation-mode-item input[type=radio]').click(function () {
        let _this = $(this);
        //当前选中值
        let _thisVal = _this.val();
        //普通模式
        if (_thisVal == '0') {
            //请求普通模式，直接从缓存里面去读，第一次已经是普通模式
        }
        //AI模式
        else if (_thisVal == '1') {
            //弹出文件选择框
            $("#upload-img").click();
        }
    });
    //文件选择框，上传图片文件:change--->click:保证每次触发
    $('#upload-img').on('change', function (e) {
        //如果没有内容，则返回
        let fileContent = $(this).val()
        if (!fileContent) {
            layer.msg("未上传图片，请重新上传!")
            return
        }
        let formData = new FormData();
        formData.append('file', $('#upload-img')[0].files[0]);  //添加图片信息的参数
        CommonTool.uploadFile("/edit/uploadAIImg", formData, function (data) {
            layer.msg("上传图片成功，AI服务正在解析中...")
            //console.log(data)
            //上传成功后，获取图片地址url。请求AI服务地址(可以在后台进行，拿到的数据，直接结合俊标模型规则，进行组装页面)

        });
    });
}
//右侧面板操作
let rightOperate = function () {
    $(".func-tab-list").on("click", "li", function () {
        let currentLi = $(this);
        let currentIndex = currentLi.index();
        //tab切换
        currentLi.addClass("active");
        currentLi.siblings().removeClass("active");
        //tab对应的内容面板切换
        let currentContentLi = $(".func-content-list li").eq(currentIndex);
        currentContentLi.addClass("active");
        currentContentLi.siblings().removeClass("active");
        //素材tab
        if (currentLi.hasClass("material-tab")) {

        } else if (currentLi.hasClass("edit-tab")) {//操作tab

        }
    });
}
/**
 * 判断是否是图片格式
 * @param imgurl
 * @returns {boolean}
 * @constructor
 */
let checkImg = function (imgUrl) {
    let postfix = "";
    let index = imgUrl.indexOf("."); //得到"."在第几位
    postfix = imgUrl.substring(index); //截断"."之前的，得到后缀
    if (postfix != ".bmp" && postfix != ".png" && postfix != ".gif" && postfix != ".jpg" && postfix != ".jpeg") {  //根据后缀，判断是否符合图片格式
        return false;
    } else {
        return true;
    }
}

//拉取图片素材:iframe加载完成后，当前pageID里面对应的artBoardId，拉取本地素材(对应的项目文件夹名称：projectId)
//need:还需素材全部下载操作；图片布局操作
let getImgsByArtBoardId = function () {
    //每次请求，清空上次的设置
    let imgListHtml = [];
    //给图片大小重新排个序，从小图到大图排序
    imgsPathArr.sort(function (a, b) {
        return a.width - b.width;
    });
    //后台获取图片输出列表
    let imgsArrPathLen = imgsPathArr.length;
    for (let i = 0; i < imgsArrPathLen; i++) {
        let imgName = imgsPathArr[i].path;
        //检验图片是否是图片，如果是，则展示出来
        if (checkImg(imgName)) {
            let imgOneUrl = `../complie/${projectId}/${imgName}`;
            imgListHtml.push(`<div class="img-item" data-magnify="gallery" data-src="${imgOneUrl}"><img src="${imgOneUrl}"   style="width:${imgsPathArr[i].width}px;"/></div>`)
        }
    }
    $(".img-item-list").html(imgListHtml.join(""));
    //图片查看器:https://nzbin.github.io/magnify/
    let viewImgUrl = "";
    $('[data-magnify]').magnify({
        headToolbar: [
            'maximize',
            'close'
        ],
        footToolbar: [
            'zoomIn',
            'zoomOut',
            'prev',
            'fullscreen',
            'next',
            'actualSize',
            'rotateRight'
        ],
        icons: {
            maximize: 'fa fa-window-maximize',
            close: 'fa fa-close',
            zoomIn: 'fa fa-search-plus',
            zoomOut: 'fa fa-search-minus',
            prev: 'fa fa-arrow-left',
            next: 'fa fa-arrow-right',
            fullscreen: 'fa fa-photo',
            actualSize: 'fa fa-arrows-alt'
        },
        //modalWidth: document.documentElement.clientWidth,
        //modalHeight: document.documentElement.clientHeight,
        modalWidth: 500,
        modalHeight: 500,
        initMaximized: false,
        initAnimation: false,
        title: false,
        callbacks: {
            //刚刚打开时
            opened: function (el) {
                let currentDom = $(el);
                //获取初始化点击的图的url
                viewImgUrl = currentDom.find("img").attr("src");
                $(".magnify-foot-toolbar").append(`<button class="magnify-button magnify-button-download" title="下载"><a href="${viewImgUrl}"download=""><i class="fa fa-download" aria-hidden="true"></i></a></button>`);
            },
            //图片发生变化时
            changed: function (el) {
                //获取当前预览图的url
                viewImgUrl = $(".magnify-stage img").attr("src");
                $(".magnify-foot-toolbar a").attr("href", viewImgUrl);
            }
        }
    });

    //$(".magnify-foot-toolbar").append('<button class="magnify-button magnify-button-zoom-in" title="zoom-in(+)">ffs<i class="fa fa-search-plus" aria-hidden="true"></i></button>');
    /*let $container = $('#masonry');
     let msnry = new Masonry($container, {
     // options
     columnWidth: 200,
     itemSelector: '.img-item',
     isAnimated: true,
     });*/

    /*$container.imagesLoaded(function () {
     $container.masonry({
     //gutter: 20,
     itemSelector: '.img-item',
     isFitWidth: true,//是否根据浏览器窗口大小自动适应默认false
     isAnimated: true,//是否采用jquery动画进行重拍版
     isRTL: false,//设置布局的排列方式，即：定位砖块时，是从左向右排列还是从右向左排列。默认值为false，即从左向右
     isResizable: true,//是否自动布局默认true
     animationOptions: {
     duration: 800,
     easing: 'easeInOutBack',//如果你引用了jQeasing这里就可以添加对应的动态动画效果，如果没引用删除这行，默认是匀速变化
     queue: false//是否队列，从一点填充瀑布流
     }
     });
     });*/
    //$container.masonry('appended', $(imgListHtml.join("")), true);
}

/**
 * 根据pageid，切换对应的artBoard列表
 */
let getArtBoardsByPageId = function (currentPid, callback) {
    //当前页面所有初步页面结构数据
    let currentPageData;
    let pagesLen = pagesData.length;
    for (let i = 0; i < pagesLen; i++) {
        let pageObj = pagesData[i];
        let pId = pageObj.pageId;
        if (pId == currentPid) {
            currentPageData = pagesData[i];
        }
    }

    //设置当前页名字
    currentPageName = currentPageData.pageName.trim();
    let currentArtBoards = currentPageData.artBoards;
    let currentArtBoardsLen = currentArtBoards.length;
    //设置当前选中的pageName
    $(".page-title").data("id", currentPid).html(currentPageName + `<em>(${currentArtBoardsLen})</em>`);
    //设置选中的pageId下面对应的artBoard列表
    let artBoardListObj = $(".artboard-list");
    let artBoardListHtmlArr = [];
    for (let i = 0; i < currentArtBoardsLen; i++) {
        let artBoardId = currentArtBoards[i].artboardId;
        let artBoardName = currentArtBoards[i].artboardName;
        let artBoardLi = `<li class="artboard ${i == 0 ? 'active' : ''}"  data-id=${artBoardId}><div><h3>${artBoardName}</h3><small>ArtBoard ${i + 1}</small></div>`;
        artBoardListHtmlArr.push(artBoardLi);
    }
    artBoardListObj.html(artBoardListHtmlArr.join(""));
    callback();
}

/**
 *
 * @param pageId
 * @param artboardId
 * 请求当前artBoardId对应的url
 */
let getPageUrlById = function () {
    //每次请求后台数据之前，需要检查当前链接是否已生成，即为已存储:若已生成，则不请求后台数据，直接在前端调取对应的页面
    let artBoardsArrLen = artboardsUrlArr.length;
    for (let i = 0; i < artBoardsArrLen; i++) {
        let artBoardsOne = artboardsUrlArr[i];
        //已生成的artBoard的id
        let artBdId = artBoardsOne.artboardId;
        //如果当前正在请求的artboard对应的id已经生成，则不请求页面
        if (currentArtboardId == artBdId) {
            currentArtBoardUrl = artBoardsOne.artBoardUrl;
            //不请求
            console.log("链接已生成，不予请求")
            urlIsGenerate = true;
        }
    }
    //如果链接生成，则调取本地已存储的网页地址，且返回
    if (urlIsGenerate) {
        $("#screen").attr("src", currentArtBoardUrl);
        //重置下
        urlIsGenerate = false;
        return;
    }
    layer.msg("页面正在加载中，请稍后...", {time: 200000000})
    //请求后台数据
    let postData = {
        pageId: currentPageId,
        artboardId: currentArtboardId
    }
    CommonTool.httpRequest("/edit/getPageById", postData, function (data) {
        //console.log("新页面，需要重新请求:" + data)
        //let dataObj = JSON.parse(data);
        currentArtBoardUrl = data.url;
        imgsPathArr = data.imgPaths;
        projectId = data.projectId;
        //关闭之前所有的信息窗口
        layer.closeAll();
        setTimeout(function () {
            layer.msg("结果不准？请尝试使用AI模式!")
        }, 1000);
        //设置对应的url
        $("#screen").attr("src", currentArtBoardUrl);
        //设置显示当前artBoardId对应的素材库
        getImgsByArtBoardId();
        //将生成的url存储在缓存数据中
        artboardsUrlArr.push({
            artboardId: currentArtboardId,
            artBoardUrl: currentArtBoardUrl
        });
        //对应artBoard生成的url数组
        console.log(artboardsUrlArr)
    }, function (error) {
        layer.msg('获取页面数据失败，错误信息:' + error.responseText)
    });
}

/**
 * 根据url显示对应的二维码
 */
let showQrCodeAndUrl = function () {
    $(".qr").hover(function () {
        $(".qr .qr-code").qrcode({
            render: "canvas", //也可以替换为table
            width: 360,
            height: 360,
            text: currentArtBoardUrl
        });
        //设置二维码链接
        $(".current-url").val(currentArtBoardUrl);
    }, function () {
        $(".qr .qr-code").html("");
    });
};

/**
 * 根据projectid来下载对应的工程压缩包到本地
 */
let downloadProject = function () {
    $(".download-btn").click(function () {
        var form = $("<form>");   //定义一个form表单
        form.attr('style', 'display:none');   //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'post');
        //本地
        form.attr('action', "/edit/download");
        $('body').append(form);  //将表单放置在web中
        form.submit();   //表单提交
    });
}

//页面初始化默认加载选中的page的第一个artBoard对应的页面
let initPage = function () {
    currentPageId = $(".page-title").data("pid");
    currentArtboardId = $(".artboard-list .artboard:first").data("id");
    //默认加载第一个
    getPageUrlById();
}