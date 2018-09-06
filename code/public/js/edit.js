/**
 * Created by alltasxiao on 2018/8/23.
 */
$(document).ready(function () {
    initPage();
    operatePage();
});

let currentArtBoardUrl, currentPageId, currentPageName, currentArtboardId, artboardsUrlArr = [], urlIsGenerate = false;
let operatePage = function () {
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
};

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
    //设置选中的额pageId下面对应的artBoard列表
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
        //延迟1s，保证生成的图片能全部生成，html可以第1次全部加载出来，无需再次刷新才出路
        layer.closeAll();
        $("#screen").attr("src", currentArtBoardUrl);
        //将生成的url存储在本地数据中
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