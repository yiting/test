/**
 * Created by alltasxiao on 2018/8/23.
 */
let currentArtBoardUrl,
  currentPageId,
  currentPageName,
  currentArtboardId,
  artboardsUrlArr = [],
  urlIsGenerate = false;
let imgsPathArr = [],
  projectId,
  projectName,
  currentArtBoardData; //存放生成的图片素材路径数组
let currentPageIndex = 1,
  _chosenNodeIds = [], // Yone
  currentArtBoardIndex = 1; //记录选中的对应page下的artBoard的序号
let currentArtBoardOnlineUrl, h5FileName;
let structureInterval, imgsInterval;

let TOSEEAPP = {
  init: function() {
    currentPageId = $(".page-title").data("pid");
    currentArtboardId = $(".artboard-list .artboard:first").data("id");
    //默认加载第一个
    this.getPageUrlById();
    //页面操作方法
    this.operatePage();
  },
  /**
   * 清空初始化dom
   */
  initDomStatus: function() {
    editUtil.hideIframeInfoDom();
  },
  /**
   * 页面操作
   */
  operatePage: function() {
    this.topOperate();
    this.leftOperate();
    this.centerOperate();
    this.rightOperate();
  },
  /**
   * 顶部header区域操作
   */
  topOperate: function() {
    let _this = this;
    $(".header-list .header-item").on("click", function() {
      let headerItem = $(this);
      //tab分为：页面、images、结构
      let headerItemIndex = headerItem.index();
      headerItem.addClass("current");
      headerItem.siblings().removeClass("current");
      //获取对应的面板对象
      let sectionItem = $(".section-list .section-item").eq(
        headerItemIndex - 1
      );
      sectionItem.show();
      sectionItem.siblings().hide();
    });
    //跳转到个人中心
    $(".back-person-btn").on("click", function() {
      top.postMessage("/person", "http://uitocode.oa.com");
    });
    //2018-11-05:各端单位代码切换
    unitSetting.initUnit();
  },

  /**
   * 左侧面板操作
   */
  leftOperate: function() {
    let _this = this;
    //跳转到主页
    $(".icon-logo").click(function() {
      top.postMessage("/", "http://uitocode.oa.com");
    });
    //下垃框点击，显示当前page下拉框
    $(".pages-select").click(function() {
      $(".pages-list").show();
    });
    //页面下拉框选择后，隐藏前page下拉框
    $(".pages-list").on("click", ".pages-item", function(e) {
      e.stopPropagation();
      $(".pages-list").hide();
    });
    //切换page
    $(".pages-list").on("change", ".pages-item input", function() {
      _this.initDomStatus();
      let inputObj = $(this);
      //当前选中page页面的id，根据pageid，切换下面的数据,并请求第一个artBoard，合成html网页
      let itemObj = inputObj.parent();
      currentPageId = inputObj.data("id");
      //获取当前选中的pageIndex
      currentPageIndex =
        $(".pages-list .pages-item[data-id=" + currentPageId + "]").index() + 1;
      $(".pages-list").hide();
      //根据pageid，切换对应的artBoard列表
      _this.getArtBoardsByPageId(currentPageId, function() {
        //切换pages，成功填充artBoard list后，然后选中第一个节点的id
        currentArtboardId = $(".artboard-list .artboard:first").data("id");
      });
      //切换刷新对应的artBoards列表，且默认查询当前page的第一个artBoard页面
      _this.getPageUrlById();
    });

    //切换artBoard：根据选择artBoardId来加载对应的ardBoard页面
    $(".artboard-list").on("click", ".artboard", function() {
      _this.initDomStatus();
      let currentArtboard = $(this);
      currentArtboard
        .addClass("active")
        .siblings()
        .removeClass("active");
      //请求当前artBoardId对应的url
      currentPageId = $(".page-title").data("pid");
      currentArtboardId = currentArtboard.data("id");
      //获取当前artBoard序号index
      currentArtBoardIndex =
        $(
          ".artboard-list .artboard[data-id=" + currentArtboardId + "]"
        ).index() + 1;
      //根据artboardId获取对应的页面url，展示该页面
      _this.getPageUrlById();
    });

    //根据url显示对应的二维码
    _this.showQrCodeAndUrl();
    //下载当前编译项目zip文件
    _this.downloadProject();
  },
  /**
   * 中间面板操作
   */
  centerOperate: function() {
    let that = this;
    //获取当前artBoard设计图
    $(".show-notes").on("change", "input[name=show-notes]", function() {
      let _this = $(this);
      if (_this.is(":checked")) {
        //显示预览图面板
        //请求后台数据
        let postData = {
          pageId: currentPageId,
          artboardId: currentArtboardId
        };
        //2018-10-12:请求设计稿当前artBoard的预览图
        CommonTool.httpRequest(
          "/edit/getArtBoardImg",
          postData,
          function(data) {
            let artBoardImgUrl =
              `../complie/${projectName}/images/` + data.artBoardImgName;
            //设置显示当前artBoardId对应的预览图
            $("#design-img-prew").attr("src", artBoardImgUrl);
            $(".slider-compare-panel,.design-img-panel").show();
          },
          function(error) {
            layer.msg("生成预览图失败:" + error.responseText);
          }
        );
      } else {
        //隐藏预览图面板
        $(".slider-compare-panel,.design-img-panel").hide();
      }
    });
  },

  /**
   *  右侧面板操作
   * */
  rightOperate: function() {
    $(".func-tab-list").on("click", "li", function() {
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
      } else if (currentLi.hasClass("edit-tab")) {
        //操作tab
      }
    });

    //2018-10-25:复制按钮
    let clipboard = new ClipboardJS(".copy-code-btn");
    clipboard.on("success", function(e) {
      console.info("Action:", e.action);
      console.info("Text:", e.text);
      console.info("Trigger:", e.trigger);
      //e.clearSelection();
    });
    clipboard.on("error", function(e) {
      console.error("Action:", e.action);
      console.error("Trigger:", e.trigger);
    });
  },

  //拉取图片素材:iframe加载完成后，当前pageID里面对应的artBoardId，拉取本地素材(对应的项目文件夹名称：projectId)
  //need:还需素材全部下载操作；图片布局操作
  getImgsByArtBoardId: function() {
    let _this = this;
    //每次请求，清空上次的设置
    let imgListHtml = [];
    //给图片大小重新排个序，从小图到大图排序
    imgsPathArr.sort(function(a, b) {
      return a.width - b.width;
    });
    //图片前端去重过滤：利用path属性过滤
    imgsPathArr = CommonTool.ES6duplicate(imgsPathArr, "path");
    let sizeUnit = "px";
    //后台获取图片输出列表
    let imgsArrPathLen = imgsPathArr.length;
    for (let i = 0; i < imgsArrPathLen; i++) {
      let imgOne = imgsPathArr[i];
      let imgPath = imgOne.path;
      let imgName = imgOne.name;
      let imgW = imgOne.width;
      let imgH = imgOne.height;
      //检验图片是否是图片，如果是，则展示出来
      if (editUtil.isImg(imgPath)) {
        let imgOneUrl = `../complie/${projectName}/images/${imgPath}`;
        //imgListHtml.push(`<div class="img-item" data-magnify="gallery" data-src="${imgOneUrl}"><img src="${imgOneUrl}"   style="width:${imgsPathArr[i].width}px;"/></div>`)
        imgListHtml.push(
          `<div class="img-item" data-magnify="gallery" data-src="${imgOneUrl}"><div class="img-item-pic"><img src="${imgOneUrl}"/></div><div class="img-item-info"><h3 class="img-item-name">${imgName}</h3><small class="img-item-size"><span data-need="unit" data-real="${imgW}">${imgW}${sizeUnit}</span> &times; <span data-need="unit" data-real="${imgH}">${imgH}${sizeUnit}</span></small></div></div>`
        );
      }
    }
    $(".img-item-list").html(imgListHtml.join(""));
    //图片查看器:https://nzbin.github.io/magnify/
    let viewImgObj,
      viewImgUrl = "",
      viewImgW = 0,
      viewImgH = 0;
    $("[data-magnify]").magnify({
      headToolbar: ["maximize", "close"],
      footToolbar: [
        "zoomIn",
        "zoomOut",
        "prev",
        "fullscreen",
        "next",
        "actualSize",
        "rotateRight"
      ],
      icons: {
        maximize: "fa fa-window-maximize",
        close: "fa fa-close",
        zoomIn: "fa fa-search-plus",
        zoomOut: "fa fa-search-minus",
        prev: "fa fa-arrow-left",
        next: "fa fa-arrow-right",
        fullscreen: "fa fa-photo",
        actualSize: "fa fa-arrows-alt"
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
        beforeOpen: function(el) {
          // Will fire before modal is opened
          let currentDom = $(el);
          //点击的图对象
          let o = currentDom.find("img");
          (viewImgW = o[0].naturalWidth), (viewImgH = o[0].naturalHeight);
        },
        opened: function(el) {
          //删除之前的图片查看弹框:如果存在多个的话，删除最后一个之前的：即为删除非最后一个
          if ($(".magnify-modal").length > 1) {
            $(".magnify-modal:last")
              .siblings(".magnify-modal")
              .remove();
          }
          let currentDom = $(el);
          //获取初始化点击的图的url
          viewImgUrl = currentDom.find("img").attr("src");
          $(".magnify-foot-toolbar").append(
            `<button class="magnify-button magnify-button-download" title="下载"><a href="${viewImgUrl}"download=""><i class="fa fa-download" aria-hidden="true"></i></a></button>`
          );
          //被查看弹框的的图片：增加宽高
          $(".magnify-stage").append(
            `<div class="show-img-info"><div class="img-width">宽:${viewImgW}px</div><div class="img-height">高:${viewImgH}px</div></div>`
          );
        },
        beforeChange: function(index) {
          // Will fire before image is changed
          // The arguments is the index of image group
        },
        //图片发生变化时
        changed: function(el) {
          //$(".show-img-info").remove();
          //获取当前预览图的url
          viewImgObj = $(".magnify-stage img");
          viewImgUrl = viewImgObj.attr("src");
          $(".magnify-foot-toolbar a").attr("href", viewImgUrl);
          (viewImgW = viewImgObj[0].naturalWidth),
            (viewImgH = viewImgObj[0].naturalHeight);
          //设置宽高
          $(".show-img-info .img-width").html(`宽:${viewImgW}px`);
          $(".show-img-info .img-height").html(`高:${viewImgH}px`);
        }
      }
    });
  },
  /**
   * 根据pageid，切换对应的artBoard列表
   */
  getArtBoardsByPageId: function(currentPid, callback) {
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
    $(".page-title")
      .data("id", currentPid)
      .html(currentPageName + `<em>(${currentArtBoardsLen})</em>`);
    //设置选中的pageId下面对应的artBoard列表
    let artBoardListObj = $(".artboard-list");
    let artBoardListHtmlArr = [];
    for (let i = 0; i < currentArtBoardsLen; i++) {
      let artBoardId = currentArtBoards[i].artboardId;
      let artBoardName = currentArtBoards[i].artboardName;
      let artBoardLi = `<li class="artboard ${
        i == 0 ? "active" : ""
      }"  data-id=${artBoardId}><div><h3>${artBoardName}</h3><small>ArtBoard ${i +
        1}</small></div>`;
      artBoardListHtmlArr.push(artBoardLi);
    }
    artBoardListObj.html(artBoardListHtmlArr.join(""));
    callback();
  },
  /**
   * 请求当前artBoardId对应的url
   */
  getPageUrlById: function() {
    let _this = this;
    //每次请求后台数据之前，需要检查当前链接是否已生成，即为已存储:若已生成，则不请求后台数据，直接在前端调取对应的页面
    let artBoardsArrLen = artboardsUrlArr.length;
    for (let i = 0; i < artBoardsArrLen; i++) {
      let artBoardsOne = artboardsUrlArr[i];
      //已生成的artBoard的id
      let artBdId = artBoardsOne.artboardId;
      //如果当前正在请求的artboard对应的id已经生成，则不请求页面
      if (currentArtboardId == artBdId) {
        //当前服务器url
        currentArtBoardUrl = artBoardsOne.artBoardUrl;
        //在线服务器页面url
        currentArtBoardOnlineUrl = artBoardsOne.artBoardOnlineUrl;
        //当前url对象的素材
        imgsPathArr = artBoardsOne.artBoardImgs;
        //如果链接生成了，图片没有生成，则去拉取图片生成方法
        //如果返回对应artBoard的图片数组，则右侧展示
        if (imgsPathArr) {
          _this.getImgsByArtBoardId();
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
    let structureTime = 0,
      imgsTime = 0,
      structureTxt = "页面结构正在生成中，请稍后...",
      imgsTxt = "页面图片正在生成中，请稍后...";
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
    structureInterval = setInterval(function() {
      structureTime++;
      //console.log(structureTime);
      structureTxt = `页面结构正在生成中，耗时${structureTime}s...`;
      $(".layui-layer-content").html(structureTxt);
    }, 1000);
    layer.msg(structureTxt, {
      time: 200000000
    });
    //请求后台数据
    let postData = {
      //用户id、用户名:用于记录日志信息
      userId: CommonTool.getCookie("staffid") || "",
      userName: CommonTool.getCookie("staffname") || "",
      pageId: currentPageId,
      artboardId: currentArtboardId,
      pageArtBoardIndex: `${currentPageIndex + "_" + currentArtBoardIndex}`
    };
    /* console.log(
      "当前pageArtBoard序号:" +
        `${currentPageIndex + "_" + currentArtBoardIndex}`
    ); */
    //2018-10-10:请求页面骨架结构
    //根据pageid、artboardId获取页面骨架数据方法
    CommonTool.httpRequest(
      "/edit/getPageById",
      postData,
      function(data) {
        //清除生成骨架定时器
        clearInterval(structureInterval);
        //关闭之前所有的信息窗口
        layer.closeAll();
        //console.log("新页面，需要重新请求:" + data)
        //本机url地址
        currentArtBoardUrl = data.url;
        //线上url地址
        currentArtBoardOnlineUrl = data.onelineUrl;
        projectId = data.projectId;
        projectName = data.projectName;
        //获取对应页面的json数据
        //currentArtBoardData = data.htmlJson;
        h5FileName = data.htmlFileName;
        //console.log("页面数据为:" + currentArtBoardData);
        //开始生成图片定时器
        imgsInterval = setInterval(function() {
          imgsTime++;
          //console.log(imgsTime);
          structureTxt = `页面图片正在生成中，耗时${imgsTime}s...`;
          $(".layui-layer-content").html(structureTxt);
        }, 1000);
        layer.msg(imgsTxt, {
          time: 200000000
        });
        //设置对应的url
        $("#screen").attr("src", currentArtBoardUrl);
        //将生成的url存储在缓存数据中
        artboardsUrlArr.push({
          artboardId: currentArtboardId,
          artBoardUrl: currentArtBoardUrl,
          artBoardOnlineUrl: currentArtBoardOnlineUrl
        });
        //对应artBoard生成的url数组
        //console.log(artboardsUrlArr)
        //显示iframe页面后，绑定对应的事件
        iframeDom.bindIframeDom();

        let isHtmlGenerate = data.isHtmlGenerate;
        //无需生成
        if (isHtmlGenerate == false) {
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
          });
          _this.getImgsByArtBoardId();
          return;
        }
        //2018-10-10：请求图片资源:根据pageid、artboardId获取页面图片方法
        CommonTool.httpRequest(
          "/edit/getPageImgById",
          postData,
          function(data) {
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
            });
            //图片全部出来了，清空定时器
            if (imgsPathArr) {
              //clearInterval(imgInterval);
              _this.getImgsByArtBoardId();
              //刷新页面
              $("#screen").attr("src", currentArtBoardUrl);
            }
          },
          function(error) {
            //清除生成骨架定时器
            clearInterval(imgsInterval);
            layer.msg("生成页面图片失败:" + error.responseText);
          }
        );
      },
      function(error) {
        //清除生成骨架定时器
        clearInterval(structureInterval);
        layer.msg("生成页面结果失败:" + error.responseText);
      }
    );
  },

  /**
   * 根据url显示对应的二维码
   * 需要获取线上生成地址的url
   */
  showQrCodeAndUrl: function() {
    $(".qr").hover(
      function() {
        if (!currentArtBoardUrl) {
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
          text: encodeURI(currentArtBoardUrl)
        });
        //设置显示文字：地址链接
        $(".current-url").val(currentArtBoardUrl);
      },
      function() {
        //移出，清除下二维码
        $(".qr .qr-code").html("");
      }
    );
  },
  /**
   * 根据projectid来下载对应的工程压缩包到本地
   */
  downloadProject: function() {
    $(".download-btn").click(function() {
      //判断是否下载sketch源文件
      let isDownloadsketch = $(".choose-sketch-chx input[type='checkbox']").is(
        ":checked"
      );

      var form = $("<form>"); //定义一个form表单
      form.attr("style", "display:none"); //在form表单中添加查询参数
      form.attr("target", "");
      form.attr("method", "post");
      //本地
      form.attr(
        "action",
        "/edit/download?isDownloadsketch=" + isDownloadsketch
      );
      $("body").append(form); //将表单放置在web中
      form.submit(); //表单提交
    });
  },
  /**
   * 2018-11-11:Yone start:初始化框选组件
   */
  initRectChosen: function() {
    let _this = this;
    rectChosen(
      document.querySelector(".screen-viewer"),
      document.querySelector("#screen"),
      _this.reAdjust.bind(this, currentArtboardId)
    );
    var btnGroup = document.querySelector("#btn-group");
    btnGroup.setAttribute("disabled", "");
    $("#screen").load(function(event) {
      rectChosen(
        document.querySelector(".screen-viewer"),
        document.querySelector("#screen"),
        _this.reAdjust.bind(this, currentArtboardId)
      );
    });
    btnGroup.addEventListener("click", function() {
      if (_chosenNodeIds.length < 2) return;
      btnGroup.setAttribute("disabled", "");

      let postData = {
        artboardId: currentArtboardId,
        nodeIds: _chosenNodeIds,
        operate: 1
      };
      CommonTool.httpRequest(
        "/edit/adjust",
        postData,
        function(data) {
          document.querySelector("#screen").contentWindow.location.reload();
        },
        function(error) {
          btnGroup.removeAttribute("disabled");
          console.error("操作失败");
        }
      );
    });
  },
  /**
   * 2018-11-18:调整重组页面结构
   * @param {*} artboardId
   * @param {*} nodeIds
   */
  reAdjust: function(artboardId, nodeIds) {
    if (!nodeIds || !nodeIds.length) {
      _chosenNodeIds = [];
      return;
    }
    _chosenNodeIds = nodeIds;
    document.querySelector("#btn-group").removeAttribute("disabled");
  },
  // Yone end 初始化框选组件

  //2018-11-11
  /**
   * 删除重组dom节点的结构
   */
  removeRectChoosen: function() {
    let chooseRectDom = $(".choose-rect-dom");
    if (chooseRectDom || chooseRectDom.length > 0) {
      chooseRectDom.remove();
    }
  }
};
