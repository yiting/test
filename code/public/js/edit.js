/**
 * Created by alltasxiao on 2018/8/23.
 */
$(document).ready(function () {
    initPage();
    operatePage();
});


let currentArtBoardUrl, currentPageId, currentPageName, currentArtboardId, artboardsUrlArr = [], urlIsGenerate = false;
let imgsPathArr = [], projectId, projectName, currentArtBoardData;//存放生成的图片素材路径数组
let currentPageIndex = 1, currentArtBoardIndex = 1;//记录选中的对应page下的artBoard的序号
//页面初始化默认加载选中的page的第一个artBoard对应的页面
let initPage = function () {
    currentPageId = $(".page-title").data("pid");
    currentArtboardId = $(".artboard-list .artboard:first").data("id");
    //默认加载第一个
    getPageUrlById();
};
/*清空初始化dom*/
let clear = function () {
    $(".design-img-panel").hide();
    //关闭图片查看器
    $(".magnify-modal").remove();
    $(".img-item-list").html("");
}
//页面操作
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
    //切换page
    $(".pages-list").on("change", ".pages-item input", function () {
        clear();
        let inputObj = $(this);
        //当前选中page页面的id，根据pageid，切换下面的数据,并请求第一个artBoard，合成html网页
        let itemObj = inputObj.parent();
        currentPageId = inputObj.data("id");
        //获取当前选中的pageIndex
        currentPageIndex = $(".pages-list .pages-item[data-id=" + currentPageId + "]").index() + 1;
        $(".pages-list").hide();
        //根据pageid，切换对应的artBoard列表
        getArtBoardsByPageId(currentPageId, function () {
            //切换pages，成功填充artBoard list后，然后选中第一个节点的id
            currentArtboardId = $(".artboard-list .artboard:first").data("id");
        });
        //切换刷新对应的artBoards列表，且默认查询当前page的第一个artBoard页面
        getPageUrlById();
    });

    //切换artBoard：根据选择artBoardId来加载对应的ardBoard页面
    $(".artboard-list").on("click", ".artboard", function () {
        clear();
        let currentArtboard = $(this);
        currentArtboard.addClass("active").siblings().removeClass("active");
        //请求当前artBoardId对应的url
        currentPageId = $(".page-title").data("pid");
        currentArtboardId = currentArtboard.data("id");
        //获取当前artBoard序号index
        currentArtBoardIndex = $(".artboard-list .artboard[data-id=" + currentArtboardId + "]").index() + 1;
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
    //获取当前artBoard设计图
    $(".design-img-btn").click(function () {
        let _this = $(this);
        let showPanelFlag = _this.data("show");
        //0:默认隐藏，点击请求预览图，显示面板；1：已显示预览图，点击隐藏面板
        if (showPanelFlag == 0) {//显示预览图面板
            //请求后台数据
            let postData = {
                pageId: currentPageId,
                artboardId: currentArtboardId
            }
            //2018-10-12:请求设计稿当前artBoard的预览图
            CommonTool.httpRequest("/edit/getArtBoardImg", postData, function (data) {
                let artBoardImgUrl = `../complie/${projectName}/` + data.artBoardImgName + ".png";
                //设置显示当前artBoardId对应的预览图
                _this.data("show", 1);
                $("#design-img-prew").attr("src", artBoardImgUrl);
                _this.text("隐藏设计稿");
                $(".design-img-panel").show();
            }, function (error) {
                layer.msg('生成预览图失败:' + error.responseText)
            });
        } else if (showPanelFlag == 1) {//隐藏预览图面板
            _this.data("show", 0);
            _this.text("比对设计稿");
            $(".design-img-panel").hide();
        }
    });
}
/**
 * 对iframe dom操作，显示具体信息
 */
let chooseDom = function () {
    //2018-10-24:选中元素操作
    $("#screen").load(function (event) {
        //let val = $("#screen").contents().find("div[data-id=11F1A381-992E-475F-ABA2-7BC1FF08FEEF]").text();
        //alert(val)
        //获取当前缩放的font-size基数
        let baseFontSize = parseFloat($("#screen").contents().find("html").css("font-size").replace("px", ""));
        //选中节点样式1
        let chooseDomStyle = {
            //"border": "1px solid #2c81f8"
            //"box-sizing": "border-box"
        }, noChooseDomStyle = {
            //"border": "none"
        };
        //iframe内部监听事件
        $("#screen").contents().on("click", function (e) {
            //alert('change');
            e = window.event || e; // 兼容IE7
            //当前选中的节点
            let chooseElement = $(e.srcElement || e.target);
            //选中节点后，弹出右侧属性边框面板
            $(".attribute-show-panel").removeClass("fadeOutRight").addClass("slideInRight");
            let isHasChildEle = false;
            let chooseElementChildLen = chooseElement.children().length;
            if (chooseElement.children().length > 0) {
                isHasChildEle = true;
                console.log("有子节点！");
            } else {
                isHasChildEle = false;
                console.log("没有子节点了！");
            }
            //没有子节点，针对最细粒度节点操作
            if (!isHasChildEle || chooseElementChildLen <= 2) {
                //1.dom节点属性信息
                //文本
                let txt = chooseElement.text();
                let domClass = chooseElement.attr("class"), bac = chooseElement.css("background-image");
                //基础属性
                //let positionX = (parseFloat(chooseElement.css("left")) / baseFontSize).toFixed(2);
                //let positionY = (parseFloat(chooseElement.css("top")) / baseFontSize).toFixed(2);
                //重新获取
                let positionX = parseFloat((parseFloat(chooseElement.offset().left) / baseFontSize).toFixed(2));
                let positionY = parseFloat((parseFloat(chooseElement.offset().top) / baseFontSize).toFixed(2));
                //获取当前的padding:padding-left、padding-right、padding-top、padding-bottom
                let ElementPT = parseFloat((parseFloat(chooseElement.css("padding-top")) / baseFontSize).toFixed(2));
                let ElementPR = parseFloat((parseFloat(chooseElement.css("padding-right")) / baseFontSize).toFixed(2));
                let ElementPB = parseFloat((parseFloat(chooseElement.css("padding-bottom")) / baseFontSize).toFixed(2));
                let ElementPL = parseFloat((parseFloat(chooseElement.css("padding-left")) / baseFontSize).toFixed(2));
                let ElementWidth = parseFloat((parseFloat(chooseElement.css("width")) / baseFontSize).toFixed(2));
                let ElementHeight = parseFloat((parseFloat(chooseElement.css("height")) / baseFontSize).toFixed(2));
                let ElementOpacity = chooseElement.css("opacity");
                //设置基础属性
                $(".x-val").val(positionX == 0 ? 0 : positionX + "rem");
                $(".y-val").val(positionY == 0 ? 0 : positionY + "rem");
                $(".width-val").val(ElementWidth == 0 ? 0 : ElementWidth + "rem");
                $(".height-val").val(ElementHeight == 0 ? 0 : ElementHeight + "rem");
                $(".opacity-val").val(ElementOpacity);
                //2.dom样式信息
                //设置选中节点部位不超出
                //选中节点样式2
                let chooseColor = "#ff3366";
                let chooseDomStyle2 = `<div class='choose-dom-style' style='position: absolute;left:${positionX}rem;top: ${positionY}rem;width:${ElementWidth + ElementPL + ElementPR}rem;height:${ElementHeight + ElementPT + ElementPB}rem;border:1px solid ${chooseColor}'>
                    <span class="dom-width-val" style="position: absolute;top:-19px;left:-1px;font-size:12px;line-height:15px;padding:0 2px;border: 1px solid ${chooseColor};color:#FFFFFF;font-weight:bolder;background:${chooseColor};border-radius:2px;z-index: 100;">${ElementWidth}rem</span>
                    <span class='lt' style='position: absolute;top:-3px;left:-3px;width: 5px;height: 5px;border: 1px solid ${chooseColor};border-radius:5px;box-sizing:border-box;background:#ffffff;'></span>
                    <span class='lb' style='position: absolute;bottom:-3px;left:-3px;width: 5px;height: 5px;border: 1px solid ${chooseColor};border-radius:5px;box-sizing:border-box;background:#ffffff;'></span>
                    <span class='rt' style='position: absolute;right:-3px;top:-3px;width: 5px;height: 5px;border: 1px solid ${chooseColor};border-radius:5px;box-sizing:border-box;background:#ffffff;'></span>
                    <span class='rb' style='position: absolute;right:-3px;bottom:-3px;width: 5px;height: 5px;border: 1px solid ${chooseColor};border-radius:5px;box-sizing:border-box;background:#ffffff;'></span>
                    <span class="dom-height-val" style="position: absolute;top:0;left:${ElementWidth + ElementPL + ElementPR + 0.05}rem;font-size:12px;line-height:15px;padding:0 2px;border: 1px solid ${chooseColor};color:#FFFFFF;font-weight:bolder;background:${chooseColor};border-radius:2px;z-index: 100;">${ElementHeight}rem</span>
                    </div>`;
                //给未选中的节点删除样式和属性
                $("#screen").contents().find(".choose-dom-show").css(noChooseDomStyle);
                $("#screen").contents().find("body").find(".choose-dom-style").remove();
                $("#screen").contents().find(".choose-dom-show").removeClass("choose-dom-show");
                //边框样式:显示样式边框
                $("#screen").contents().find("body").append(chooseDomStyle2);
                /*$("#screen").contents().find(".choose-dom-style").css({
                 "left": `${positionX}rem`,
                 "top": `${positionY}rem`
                 });*/
                //边框样式:添加边框等
                //chooseElement.append(chooseDomStyle2);
                //给选中的节点添加样式和属性
                chooseElement.css(chooseDomStyle);
                chooseElement.addClass("choose-dom-show");
                //设置显示的代码
                //声明选中节点生成的代码字符串
                let codeStr = `<li><span class="property">width</span><span class="colon">:</span> ${ElementWidth}rem<span class="semicolon">;</span></li>
                    <li><span class="property">height</span><span class="colon">:</span>${ElementHeight}rem<span class="semicolon">;</span></li>
                    <li><span class="property">opacity</span><span class="colon">:</span>${ElementOpacity}<span class="semicolon">;</span></li>`;
                //a.图层背景:优先检查背景
                if (domClass.includes("image")) {
                    //隐藏字体属性面板
                    $(".fontSize-panel").hide();
                    //node节点名称: 需要设置图层名称
                    $(".node-name").text("图片");
                    //设置对应的代码字符串
                    $(".language-attr-list").html(codeStr);
                    return;
                }
                //b.文本内容
                if (txt) {
                    //显示字体属性面板
                    $(".fontSize-panel").show();
                    //字体
                    let ElementColor = chooseElement.css("color");
                    let ElementFont = chooseElement.css("font-family");
                    let ElementFontSize = (parseFloat(chooseElement.css("font-size")) / baseFontSize).toFixed(2);
                    let ElementLetterSpace = chooseElement.css("letter-space") ? parseFloat(chooseElement.css("letter-space") / baseFontSize).toFixed(2) : 0;
                    let ElementLineHeight = (parseFloat(chooseElement.css("line-height")) / baseFontSize).toFixed(2);
                    //node节点名称
                    $(".node-name").text(txt);
                    //颜色块
                    $(".color-bac").css({"background-color": ElementColor});
                    $(".color-val").val(ElementColor);
                    $(".font-val").val(ElementFont);
                    $(".fontSize-val").val(ElementFontSize == 0 ? 0 : ElementFontSize + "rem");
                    //空间
                    $(".letterSpace-val").val(ElementLetterSpace);
                    $(".lineHeight-val").val(ElementLineHeight == 0 ? 0 : ElementLineHeight + "rem");
                    //拼接属性
                    codeStr += `<li><span class="property">color</span><span class="colon">:</span>${ElementColor}<span class="semicolon">;</span></li>
                        <li><span class="property">font-family</span><span class="colon">:</span>${ElementFont}<span class="semicolon">;</span></li>
                        <li><span class="property">font-size</span><span class="colon">:</span>${ElementFontSize}rem<span class="semicolon">;</span></li>
                        <li><span class="property">line-height</span><span class="colon">:</span>${ElementLineHeight}rem<span class="semicolon">;</span></li>`;
                }
                //设置对应的代码字符串
                $(".language-attr-list").html(codeStr);
            }
        });
        //点击其他地方
        $(".screen-viewer-inner").on("click", function () {
            //去掉选中样式
            //给未选中的节点删除样式和属性
            $("#screen").contents().find(".choose-dom-show").css(noChooseDomStyle);
            $("#screen").contents().find("body").find(".choose-dom-style").remove();
            $("#screen").contents().find(".choose-dom-show").removeClass("choose-dom-show");

            //选中面板其他区域，隐藏右侧属性边框面板
            $(".attribute-show-panel").removeClass("slideInRight").addClass("fadeOutRight");
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

    //2018-10-25:复制按钮
    let clipboard = new ClipboardJS('.copy-code-btn');
    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        //e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
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
    //图片前端去重过滤：利用path属性过滤
    imgsPathArr = CommonTool.ES6duplicate(imgsPathArr, "path");
    //后台获取图片输出列表
    let imgsArrPathLen = imgsPathArr.length;
    for (let i = 0; i < imgsArrPathLen; i++) {
        let imgName = imgsPathArr[i].path;
        //检验图片是否是图片，如果是，则展示出来
        if (checkImg(imgName)) {
            let imgOneUrl = `../complie/${projectName}/${imgName}`;
            //imgListHtml.push(`<div class="img-item" data-magnify="gallery" data-src="${imgOneUrl}"><img src="${imgOneUrl}"   style="width:${imgsPathArr[i].width}px;"/></div>`)
            imgListHtml.push(`<div class="img-item" data-magnify="gallery" data-src="${imgOneUrl}"><img src="${imgOneUrl}"/></div>`)
        }
    }
    $(".img-item-list").html(imgListHtml.join(""));
    //图片查看器:https://nzbin.github.io/magnify/
    let viewImgObj, viewImgUrl = "", viewImgW = 0, viewImgH = 0;
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
        title: true,
        callbacks: {
            //刚刚打开时
            beforeOpen: function (el) {
                // Will fire before modal is opened
                let currentDom = $(el);
                //点击的图对象
                let o = currentDom.find("img");
                viewImgW = o[0].naturalWidth, viewImgH = o[0].naturalHeight;
            },
            opened: function (el) {
                //删除之前的图片查看弹框:如果存在多个的话，删除最后一个之前的：即为删除非最后一个
                if ($(".magnify-modal").length > 1) {
                    $(".magnify-modal:last").siblings(".magnify-modal").remove();
                }
                let currentDom = $(el);
                //获取初始化点击的图的url
                viewImgUrl = currentDom.find("img").attr("src");
                $(".magnify-foot-toolbar").append(`<button class="magnify-button magnify-button-download" title="下载"><a href="${viewImgUrl}"download=""><i class="fa fa-download" aria-hidden="true"></i></a></button>`);
                //被查看弹框的的图片：增加宽高
                $(".magnify-stage").append(`<div class="show-img-info"><div class="img-width">宽:${viewImgW}px</div><div class="img-height">高:${viewImgH}px</div></div>`)
            },
            beforeChange: function (index) {
                // Will fire before image is changed
                // The arguments is the index of image group
            },
            //图片发生变化时
            changed: function (el) {
                //$(".show-img-info").remove();
                //获取当前预览图的url
                viewImgObj = $(".magnify-stage img");
                viewImgUrl = viewImgObj.attr("src");
                $(".magnify-foot-toolbar a").attr("href", viewImgUrl);
                viewImgW = viewImgObj[0].naturalWidth, viewImgH = viewImgObj[0].naturalHeight;
                //设置宽高
                $(".show-img-info .img-width").html(`宽:${viewImgW}px`);
                $(".show-img-info .img-height").html(`高:${viewImgH}px`);
            }
        }
    });
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
let onlineUrl;
let structureInterval, imgsInterval;
let getPageUrlById = function () {
    //每次请求后台数据之前，需要检查当前链接是否已生成，即为已存储:若已生成，则不请求后台数据，直接在前端调取对应的页面
    let artBoardsArrLen = artboardsUrlArr.length;
    for (let i = 0; i < artBoardsArrLen; i++) {
        let artBoardsOne = artboardsUrlArr[i];
        //已生成的artBoard的id
        let artBdId = artBoardsOne.artboardId;
        //如果当前正在请求的artboard对应的id已经生成，则不请求页面
        if (currentArtboardId == artBdId) {
            //当前url
            currentArtBoardUrl = artBoardsOne.artBoardUrl;
            //当前url对象的素材
            imgsPathArr = artBoardsOne.artBoardImgs;

            //如果链接生成了，图片没有生成，则去拉取图片生成方法

            //如果返回对应artBoard的图片数组，则右侧展示
            if (imgsPathArr) {
                getImgsByArtBoardId();
            }
            //不请求
            //console.log("链接已生成，不予请求")
            urlIsGenerate = true;
        }
    }
    //如果链接生成，则调取本地已存储的网页地址，且返回
    if (urlIsGenerate) {
        //设置对应的链接
        $("#screen").attr("src", currentArtBoardUrl);
        //设置对应的素材库(直接本地读取)
        //重置下
        urlIsGenerate = false;
        return;
    }
    let structureTime = 0, imgsTime = 0, structureTxt = "页面结构正在生成中，请稍后...", imgsTxt = "页面图片正在生成中，请稍后...";
    //如果存在的话，则去除结构interval
    if (structureInterval) {
        clearInterval(structureInterval);
    }
    //如果存在的话，则去除图片interval
    if (imgsInterval) {
        clearInterval(imgsInterval);
    }
    //如果存在消息条弹框，则删除消息条弹框节点
    if ($(".layui-layer-msg").length > 0) {
        $(".layui-layer-msg").remove();
    }
    structureInterval = setInterval(function () {
        structureTime++;
        //console.log(structureTime);
        structureTxt = `页面结构正在生成中，耗时${structureTime}s...`
        $(".layui-layer-content").html(structureTxt);
    }, 1000);
    layer.msg(structureTxt, {time: 200000000});
    //请求后台数据
    let postData = {
        pageId: currentPageId,
        artboardId: currentArtboardId,
        pageArtBoardIndex: `${currentPageIndex + '_' + currentArtBoardIndex}`
    }
    console.log("当前pageArtBoard序号:" + `${currentPageIndex + '_' + currentArtBoardIndex}`)
    //2018-10-10:请求页面骨架结构
    pageAjaxFun(postData, function (data) {
        //清除生成骨架定时器
        clearInterval(structureInterval);
        //关闭之前所有的信息窗口
        layer.closeAll();
        //console.log("新页面，需要重新请求:" + data)
        currentArtBoardUrl = data.url;
        projectId = data.projectId;
        projectName = data.projectName;
        //获取对应页面的json数据
        currentArtBoardData = data.htmlJson;
        //console.log("页面数据为:" + currentArtBoardData);
        //开始生成图片定时器
        imgsInterval = setInterval(function () {
            imgsTime++;
            //console.log(imgsTime);
            structureTxt = `页面图片正在生成中，耗时${imgsTime}s...`
            $(".layui-layer-content").html(structureTxt);
        }, 1000);
        layer.msg(imgsTxt, {time: 200000000})
        //设置对应的url
        $("#screen").attr("src", currentArtBoardUrl);
        //将生成的url存储在缓存数据中
        artboardsUrlArr.push({
            artboardId: currentArtboardId,
            artBoardUrl: currentArtBoardUrl
        });
        //对应artBoard生成的url数组
        //console.log(artboardsUrlArr)

        //显示iframe页面后，绑定对应的事件
        chooseDom();
        /*$("#screen").load(function (event) {
         //let val = $("#screen").contents().find("div[data-id=11F1A381-992E-475F-ABA2-7BC1FF08FEEF]").text();
         //alert(val)
         $("#screen").contents().on("click", function (e) {
         //alert('change');
         e = window.event || e; // 兼容IE7
         var obj = $(e.srcElement || e.target);
         alert(obj.text())
         });
         });*/
        /*$("#screen").load(function (event) {//判断 iframe是否加载完成  这一步很重要
         alert("加载iframe完成")
         $(document).click(function (e) {
         e = window.event || e; // 兼容IE7
         var obj = $(e.srcElement || e.target);
         alert(obj.data("id"));
         });
         });*/
    }, function (error) {
        //清除生成骨架定时器
        clearInterval(structureInterval);
        layer.msg('生成页面结果失败:' + error.responseText)
    })
    //2018-10-10：请求图片资源
    imgAjaxFun(postData, function (data) {
        //清除生成图片生成定时器
        clearInterval(imgsInterval);
        //关闭之前所有的信息窗口
        layer.closeAll();
        imgsPathArr = data.imgPaths;
        //2018-10-10:如果图片生成了，再次进行排序，显示图片，且重新加载页面
        //设置显示当前artBoardId对应的素材库
        artboardsUrlArr.forEach((item, i) => {
            if (item.artboardId == currentArtboardId) {
                artboardsUrlArr[i].artBoardImgs = imgsPathArr;
            }
        })
        //图片全部出来了，清空定时器
        if (imgsPathArr) {
            //clearInterval(imgInterval);
            getImgsByArtBoardId();
            //刷新页面
            $("#screen").attr("src", currentArtBoardUrl);
            //再次请求生成url
            //这个过程中可以去请求url
            //发送一个请求，将生成好的文件上传到后台服务器，返回在线url
            prviewImgAjaxFun(postData, function (resultData) {
                onlineUrl = resultData.url;
                //设置显示文字：地址链接
                $(".current-url").val(onlineUrl);
            }, function (error) {
                layer.msg("生成二维码失败")
            });
        }
    }, function (error) {
        //清除生成骨架定时器
        clearInterval(imgsInterval);
        layer.msg('生成页面图片失败:' + error.responseText)
    });
}
/**
 *根据pageid、artboardId获取页面骨架数据方法
 * @param postData
 * @param successCallback
 * @param failCallback
 */
let pageAjaxFun = function (postData, successCallback, failCallback) {
    let pageAjax = CommonTool.httpRequest("/edit/getPageById", postData, function (data) {
        successCallback(data);
    }, function (error) {
        failCallback(error);
    });
}
/**
 *根据pageid、artboardId获取页面图片方法
 * @param postData
 * @param successCallback
 * @param failCallback
 */
let imgAjaxFun = function (postData, successCallback, failCallback) {
    let imgAjax = CommonTool.httpRequest("/edit/getPageImgById", postData, function (data) {
        successCallback(data);
    }, function (error) {
        failCallback(error);
    });
}
/**
 * 根据pageid、artboardId获取页面设计稿方法
 * @param postData
 * @param successCallback
 * @param failCallback
 */
let prviewImgAjaxFun = function (postData, successCallback, failCallback) {
    let imgAjax = CommonTool.httpRequest("/edit/getOnlineUrl", postData, function (data) {
        successCallback(data);
    }, function (error) {
        failCallback(error);
    });
}


/**
 * 根据url显示对应的二维码
 * 需要获取线上生成地址的url
 */
let showQrCodeAndUrl = function () {
    $(".qr").hover(function () {
        if (!onlineUrl) {
            layer.msg("二维码正在生成中，请稍后...");
            //没有生成处理，则隐藏
            $(".qr i").hide();
            return;
        }
        //生成出来了，则显示
        $(".qr i").show();
        //移出，清除下二维码
        $(".qr .qr-code").html("");
        $(".qr .qr-code").qrcode({
            render: "canvas", //也可以替换为table
            width: 360,
            height: 360,
            text: encodeURI(onlineUrl)
        });
    }, function () {
        //移出，清除下二维码
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
