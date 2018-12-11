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

/**
 * 各端单位切换
 */
let TOSEEConfig = {
  scale: "56",
  unit: "rem",
  zoom: 1
};
let TOSEEAPP = {
  initPage: function() {
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
  initFunc: function() {
    $(".design-img-btn")
      .data("show", 0)
      .text("比对设计稿");
    //关闭图片查看器
    $(".magnify-modal").remove();
    $(".img-item-list").html("");
    this.hideIframeInfoDom();
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
    _this.initUnit();
  },
  /**
   * 单位转换
   */
  unitSize: function(length, isText) {
    //var length = Math.round((length / TOSEEConfig.scale) * 10) / 10,
    var length =
      Math.round((length / TOSEEConfig.scale) * Math.pow(10, 2)) /
      Math.pow(10, 2);
    (units = TOSEEConfig.unit.split("/")), (unit = units[0]);
    if (units.length > 1 && isText) {
      unit = units[1];
    }
    return length + unit;
  },
  /**
   * 初始化单位面板
   */
  initUnit: function() {
    let _this = this;
    (unitsData = [
      {
        units: [
          {
            name: "标准",
            unit: "px",
            scale: 1
          }
        ]
      },
      {
        name: "iOS",
        units: [
          {
            name: "Points" + " @1x",
            unit: "pt",
            scale: 1
          },
          {
            name: "Retina" + " @2x",
            unit: "pt",
            scale: 2
          },
          {
            name: "Retina HD" + " @3x",
            unit: "pt",
            scale: 3
          }
        ]
      },
      {
        name: "Android",
        units: [
          {
            name: "LDPI @0.75x",
            unit: "dp/sp",
            scale: 0.75
          },
          {
            name: "MDPI @1x",
            unit: "dp/sp",
            scale: 1
          },
          {
            name: "HDPI @1.5x",
            unit: "dp/sp",
            scale: 1.5
          },
          {
            name: "XHDPI @2x",
            unit: "dp/sp",
            scale: 2
          },
          {
            name: "XXHDPI @3x",
            unit: "dp/sp",
            scale: 3
          },
          {
            name: "XXXHDPI @4x",
            unit: "dp/sp",
            scale: 4
          }
        ]
      },
      {
        name: "Web",
        units: [
          {
            name: "CSS Rem 12px",
            unit: "rem",
            scale: 12
          },
          {
            name: "CSS Rem 14px",
            unit: "rem",
            scale: 14
          },
          //系统默认的
          {
            name: "CSS Rem 56px",
            unit: "rem",
            scale: 56
          }
        ]
      }
    ]),
      (unitHtml = []),
      (unitList = []),
      (unitCurrent = ""),
      (hasCurrent = "");
    $.each(unitsData, function(index, data) {
      if (data.name)
        unitList.push('<li class="sub-title">' + data.name + "</li>");
      $.each(data.units, function(index, unit) {
        var checked = "";
        if (unit.unit == TOSEEConfig.unit && unit.scale == TOSEEConfig.scale) {
          checked = ' checked="checked"';
          hasCurrent = unit.name;
        }
        unitList.push(
          '<li><label><input type="radio" name="resolution" data-name="' +
            unit.name +
            '" data-unit="' +
            unit.unit +
            '" data-scale="' +
            unit.scale +
            '"' +
            checked +
            "><span>" +
            unit.name +
            "</span></label></li>"
        );
      });
    });
    if (!hasCurrent) {
      unitCurrent =
        '<li><label><input type="radio" name="resolution" data-name="' +
        "Custom" +
        " (" +
        TOSEEConfig.scale +
        ", " +
        TOSEEConfig.unit +
        ')" data-unit="' +
        TOSEEConfig.unit +
        '" data-scale="' +
        TOSEEConfig.scale +
        '" checked="checked"><span>' +
        "Custom" +
        " (" +
        TOSEEConfig.scale +
        ", " +
        TOSEEConfig.unit +
        ")</span></label></li>";
      hasCurrent =
        "Custom" + " (" + TOSEEConfig.scale + ", " + TOSEEConfig.unit + ")";
    }
    unitHtml.push(
      '<div class="overlay"></div>',
      "<h3>" + "分辨率" + "</h3>",
      "<p>" + hasCurrent + "</p>",
      "<ul>",
      unitCurrent,
      unitList.join(""),
      "</ul>"
    );
    $("#unit").html(unitHtml.join(""));

    //监听unit
    $("#unit")
      .on("change", "input[name=resolution]", function() {
        var $checked = $("input[name=resolution]:checked");
        TOSEEConfig.unit = $checked.attr("data-unit");
        TOSEEConfig.scale = Number($checked.attr("data-scale"));
        $("#unit")
          .blur()
          .find("p")
          .text($checked.attr("data-name"));
        //重新设置对应的单位转换
        _this.resetUnit();
      })
      .on("click", "h3, .overlay", function() {
        $("#unit").blur();
      });
  },
  resetUnit: function() {
    let _this = this;
    let needChangeDomList1 = $("#screen")
      .contents()
      .find('*[data-need="unit"]');
    let needChangeDomList2 = $('*[data-need="unit"]');
    _this.domChangeUnit(needChangeDomList1);
    _this.domChangeUnit(needChangeDomList2);
  },
  domChangeUnit: function(domList) {
    let _this = this;
    domList.each(function() {
      let _thisDom = $(this);
      let _thisDomVal = parseFloat(_thisDom.data("real"));
      let fontAttrFlag = false;
      if (_thisDom.data("needFont")) {
        fontAttrFlag = true;
      }
      _thisDomVal = _this.unitSize(_thisDomVal, fontAttrFlag);
      _thisDom.val(_thisDomVal).text(_thisDomVal);
    });
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
      _this.initFunc();
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
      _this.initFunc();
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
   * 对iframe dom操作，显示具体信息
   */
  bindIframeDom: function() {
    let _this = this;
    //2018-10-24:选中元素操作
    $("#screen").load(function(event) {
      let screenHeight = this.contentWindow.document.documentElement
        .scrollHeight;
      //this.height = screenHeight;
      $(this).height(screenHeight);
      $(".design-img").height(screenHeight);
      let verticalLineHeight = screenHeight + 15;
      //操作伪类，更改其高度
      let modifyAfterHeight =
        "<style>#data-area-slider .slider-handle::before,#data-area-slider .slider-handle::after{content:'';height:" +
        verticalLineHeight +
        "px !important;}</style>";
      $("head").append(modifyAfterHeight);

      //获取当前缩放的font-size基数
      let baseFontSize = parseFloat(
        $("#screen")
          .contents()
          .find("html")
          .css("font-size")
          .replace("px", "")
      );
      let iframeBody = $("#screen")
          .contents()
          .find("body"),
        operateBody = $(".operate-dom-panel");
      //2018-10-30:移入到元素效果
      //iframe内部监听事件
      //2018-10-29:移入iframe内部元素，出现边框线
      let hoverElement,
        chooseElement,
        positionX,
        positionXReal,
        positionY,
        positionYReal,
        ElementPT,
        ElementPTReal,
        ElementPR,
        ElementPRReal,
        ElementPB,
        ElementPBReal,
        ElementPL,
        ElementPLReal,
        ElementWidth,
        ElementWidthReal,
        ElementHeight,
        ElementHeightReal,
        ElementTxt,
        ElementClass;

      //2018-12-05:页面操作dom节点
      let operatePanel = [];
      //iframe内部监听事件
      //hover
      iframeBody.mousemove(function(e) {
        e = window.event || e; // 兼容IE7
        //当前选中的节点
        hoverElement = $(e.srcElement || e.target);
        //移入在选中之前，将移入的对象赋值给选中对象
        chooseElement = hoverElement;
        //没有子节点，针对最细粒度节点操作
        if (hoverElement[0].className.indexOf("body") <= -1) {
          //重新获取
          /*positionX = parseFloat(
              (parseFloat(hoverElement.offset().left) / baseFontSize).toFixed(2)
            );*/
          positionXReal = hoverElement.offset().left;
          positionX = _this.unitSize(positionXReal);

          positionYReal = hoverElement.offset().top;
          positionY = _this.unitSize(positionYReal);

          //获取当前的padding:padding-left、padding-right、padding-top、padding-bottom
          ElementPTReal = parseFloat(
            hoverElement.css("padding-top").replace("px", "")
          );
          ElementPT = _this.unitSize(ElementPTReal);

          ElementPRReal = parseFloat(
            hoverElement.css("padding-right").replace("px", "")
          );
          ElementPR = _this.unitSize(ElementPRReal);

          ElementPBReal = parseFloat(
            hoverElement.css("padding-bottom").replace("px", "")
          );
          ElementPB = _this.unitSize(ElementPBReal);

          ElementPLReal = parseFloat(
            hoverElement.css("padding-left").replace("px", "")
          );
          ElementPL = _this.unitSize(ElementPLReal);

          ElementWidthReal = parseFloat(
            hoverElement.css("width").replace("px", "")
          );
          ElementWidth = _this.unitSize(ElementWidthReal);

          ElementHeightReal = parseFloat(
            hoverElement.css("height").replace("px", "")
          );
          ElementHeight = _this.unitSize(ElementHeightReal);

          //去除其他
          _this.hideHoverDom();
          //当前hover节点添加
          //边框样式:显示样式边框
          //当前hover节点添加
          //边框样式:显示样式边框
          operateBody.find(".rules .rule-v").css({
            left: `${positionXReal}px`,
            width: `${ElementWidthReal + ElementPLReal + ElementPRReal}px`
          });
          operateBody.find(".rules .rule-h").css({
            top: `${positionYReal}px`,
            height: `${ElementHeightReal + ElementPTReal + ElementPBReal}px`
          });
          operateBody.find(".rules").show();
          //$(hoverElement).css("background","rgba(0,0,0,.5)");
          $(hoverElement).addClass("hover-dom-show");

          //移入的时候，进行测量间距
          //调用测量方法
          _this.measureDistance();
        }
      });
      //click
      iframeBody.on("click", function(e) {
        //当前选中的节点:移入即为将要点击的对象,在去除移入样式前获取该对象
        chooseElement = iframeBody.find(".hover-dom-show");
        if (chooseElement.length == 0) {
          return;
        }
        //清除hover样式节点、将标线隐藏
        _this.hideHoverDom();
        //隐藏测距样式
        _this.hideDistance();
        //选中节点后，弹出右侧属性边框面板
        _this.showAttrPanel();
        let chooseElementChildLen = chooseElement.children().length;
        //没有子节点，针对最细粒度节点操作
        if (hoverElement[0].className.indexOf("body") <= -1) {
          //1.dom节点属性信息
          //文本
          ElementTxt = chooseElement.text();
          ElementClass = chooseElement.attr("class");
          //基础属性
          //let positionX = (parseFloat(chooseElement.css("left")) / baseFontSize).toFixed(2);
          //let positionY = (parseFloat(chooseElement.css("top")) / baseFontSize).toFixed(2);
          let ElementOpacity =
            Math.round(chooseElement.css("opacity") * 10000) / 100 + "%";
          //设置基础属性&2018-11-06:真实px值
          $(".x-val")
            .val(positionX)
            .data("real", positionXReal);
          $(".y-val")
            .val(positionY)
            .data("real", positionYReal);
          $(".width-val")
            .val(ElementWidth)
            .data("real", ElementWidthReal);
          $(".height-val")
            .val(ElementHeight)
            .data("real", ElementHeightReal);
          $(".opacity-val").val(ElementOpacity);
          //2.dom样式信息
          //选中节点样式2
          //首先给未选中的节点删除样式和属性
          _this.hideChooseDom();
          //初始化隐藏测距dom
          _this.hideDistance();
          //然后给选中的添加选中样式
          $(".dom-width-val")
            .data("real", `${ElementWidthReal + ElementPLReal + ElementPRReal}`)
            .text(`${ElementWidth}`)
            .show();
          $(".dom-height-val")
            .data(
              "real",
              `${ElementHeightReal + ElementPTReal + ElementPBReal}`
            )
            .text(`${ElementHeight}`)
            .css({
              left: `${ElementWidthReal + ElementPLReal + ElementPRReal}px`
            })
            .show();
          $(".choose-dom-style")
            .css({
              left: `${positionXReal}px`,
              top: `${positionYReal}px`,
              width: `${ElementWidthReal + ElementPLReal + ElementPRReal}px`,
              height: `${ElementHeightReal + ElementPTReal + ElementPBReal}px`
            })
            .show();

          //给选中的节点元素添加样式和属性
          chooseElement.addClass("choose-dom-show");
          //设置显示的代码
          //声明选中节点生成的代码字符串
          let codeStr = `<li><span class="property">width</span><span class="colon">:</span><span class="property-width" data-need="unit" data-real="${ElementWidthReal}">${ElementWidth}</span><span class="semicolon">;</span></li>
                    <li><span class="property">height</span><span class="colon">:</span><span class="property-height" data-need="unit" data-real="${ElementHeightReal}">${ElementHeight}</span><span class="semicolon">;</span></li>
                    <li><span class="property">opacity</span><span class="colon">:</span><span class="property-opacity">${ElementOpacity}</span><span class="semicolon">;</span></li>`;
          //a.图层背景:优先检查背景
          if (ElementClass.includes("image")) {
            //隐藏字体属性面板
            $(".fontSize-panel").hide();
            //node节点名称: 需要设置图层名称
            $(".node-name").text("图片");
            //设置对应的代码字符串
            $(".language-attr-list").html(codeStr);
            return;
          }
          //b.文本内容
          if (ElementTxt) {
            //显示字体属性面板
            $(".fontSize-panel").show();
            //字体
            let ElementColor = chooseElement.css("color");
            let ElementFont = chooseElement.css("font-family");

            let ElementFontSizeReal = parseFloat(
              chooseElement.css("font-size").replace("px", "")
            );
            let ElementFontSize = _this.unitSize(ElementFontSizeReal);

            let ElementLetterSpaceReal = chooseElement.css("letter-space")
              ? parseFloat(chooseElement.css("letter-space").replace("px", ""))
              : 0;
            let ElementLetterSpace = _this.unitSize(ElementLetterSpaceReal);

            let ElementLineHeightReal = parseFloat(
              chooseElement.css("line-height").replace("px", "")
            );
            let ElementLineHeight = _this.unitSize(ElementLineHeightReal);
            //node节点名称
            $(".node-name").text(ElementTxt);
            //颜色块
            $(".color-bac").css({
              "background-color": ElementColor
            });
            $(".color-val").val(ElementColor);
            $(".font-val").val(ElementFont);
            $(".fontSize-val")
              .val(ElementFontSize)
              .data("real", ElementFontSizeReal);
            //空间
            $(".letterSpace-val")
              .val(ElementLetterSpace)
              .data("real", ElementLetterSpaceReal);
            $(".lineHeight-val")
              .val(ElementLineHeight)
              .data("real", ElementLineHeightReal);
            //拼接属性
            codeStr += `<li><span class="property">color</span><span class="colon">:</span><span class="property-color">${ElementColor}</span><span class="semicolon">;</span></li>
                        <li><span class="property">font-family</span><span class="colon">:</span><span class="property-fontFamily">${ElementFont}</span><span class="semicolon">;</span></li>
                        <li><span class="property">font-size</span><span class="colon">:</span><span class="property-size" data-need="unit" data-real="${ElementFontSizeReal}">${ElementFontSize}</span><span class="semicolon">;</span></li>
                        <li><span class="property">line-height</span><span class="colon">:</span><span class="property-lineHeight" data-need="unit" data-real="${ElementLineHeightReal}">${ElementLineHeight}</span><span class="semicolon">;</span></li>`;
          }
          //设置对应的代码字符串
          $(".language-attr-list").html(codeStr);
        }
      });
      //点击其他地方
      $(".screen-viewer-inner").on("click", function() {
        //1.去掉选中样式
        //给未选中的节点删除样式和属性
        _this.hideChooseDom();
        //2.去掉移入样式
        _this.hideHoverDom();
        //3.初始化隐藏测距dom
        _this.hideDistance();
        //4.选中面板其他区域，隐藏右侧属性边框面板
        _this.hideAttrPanel();
      });
    });
  },
  /**
   * 测量当前choose Dom与hover Dom的距离
   */
  measureDistance: function() {
    let _this = this;
    //测量显示choose Dom与hover Dom的距离
    _this.domDistance();
  },
  /**
   * 显示choose dom和hover dom的距离
   */
  domDistance: function() {
    let _this = this;
    //初始化隐藏测距dom
    _this.hideDistance();
    //隐藏选中节点的宽高信息
    _this.hideChooseDistance();

    //分为2种情况:1.所选择dom处于移入dom内侧  2.所选dom不在移入dom内侧
    let topData, rightData, bottomData, leftData;
    //获取当前选择的节点dom、移入的dom
    let iframeBody = $("#screen")
        .contents()
        .find("body"),
      operateBody = $(".operate-dom-panel");
    let distanceChooseDom = iframeBody.find(".choose-dom-show"),
      distanceHoverDom = iframeBody.find(".hover-dom-show");
    //如果选择dom和移入dom均不存在，则不执行
    if (distanceChooseDom.length == 0 || distanceHoverDom.length == 0) {
      return;
    }

    let _distanceChooseDomData = {
        x: distanceChooseDom.offset().left,
        y: distanceChooseDom.offset().top,
        w: distanceChooseDom.width(),
        h: distanceChooseDom.height(),
        maxX: distanceChooseDom.offset().left + distanceChooseDom.width(),
        maxY: distanceChooseDom.offset().top + distanceChooseDom.height()
      },
      _distanceChooseHoverDomData = {
        x: distanceHoverDom.offset().left,
        y: distanceHoverDom.offset().top,
        w: distanceHoverDom.width(),
        h: distanceHoverDom.height(),
        maxX: distanceHoverDom.offset().left + distanceHoverDom.width(),
        maxY: distanceHoverDom.offset().top + distanceHoverDom.height()
      };

    //1.所选择dom处于移入dom内侧

    //2.所选dom不在移入dom内侧

    //上部
    if (_distanceChooseHoverDomData.maxY < _distanceChooseDomData.y) {
      topData = {
        x: _distanceChooseDomData.x + _distanceChooseDomData.w / 2,
        y: _distanceChooseHoverDomData.maxY,
        h: _distanceChooseDomData.y - _distanceChooseHoverDomData.maxY
      };
    }

    //右部
    if (_distanceChooseHoverDomData.x > _distanceChooseDomData.maxX) {
      rightData = {
        x: _distanceChooseDomData.maxX,
        y: _distanceChooseDomData.y + _distanceChooseDomData.h / 2,
        w: _distanceChooseHoverDomData.x - _distanceChooseDomData.maxX
      };
    }

    //底部
    if (_distanceChooseHoverDomData.y > _distanceChooseDomData.maxY) {
      bottomData = {
        x: _distanceChooseDomData.x + _distanceChooseDomData.w / 2,
        y: _distanceChooseDomData.maxY,
        h: _distanceChooseHoverDomData.y - _distanceChooseDomData.maxY
      };
    }

    //左侧
    if (_distanceChooseHoverDomData.maxX < _distanceChooseDomData.x) {
      leftData = {
        x: _distanceChooseHoverDomData.maxX,
        y: _distanceChooseDomData.y + _distanceChooseDomData.h / 2,
        w: _distanceChooseDomData.x - _distanceChooseHoverDomData.maxX
      };
    }

    //顶部距离
    if (topData) {
      operateBody
        .find("#td")
        .css({
          left: topData.x,
          top: topData.y,
          height: topData.h
        })
        .show();
      //动态计算线内容所在位置
      let topDVDom = operateBody.find(".top-d-v");
      topDVDom
        .css({
          top: (topData.h - topDVDom.height()) / 2
        })
        .text(_this.unitSize(topData.h));
    }
    //右侧距离
    if (rightData) {
      operateBody
        .find("#rd")
        .css({
          left: rightData.x,
          top: rightData.y,
          width: rightData.w
        })
        .show();
      //动态计算线内容所在位置
      let rightDVDom = operateBody.find(".right-d-v");
      rightDVDom
        .css({
          left: (rightData.w - rightDVDom.width()) / 2
        })
        .text(_this.unitSize(rightData.w));
    }
    //底部距离
    if (bottomData) {
      operateBody
        .find("#bd")
        .css({
          left: bottomData.x,
          top: bottomData.y,
          height: bottomData.h
        })
        .show();
      //动态计算线内容所在位置
      let bottomDVDom = operateBody.find(".bottom-d-v");
      bottomDVDom
        .css({
          top: (bottomData.h - bottomDVDom.height()) / 2
        })
        .text(_this.unitSize(bottomData.h));
    }
    //左侧距离
    if (leftData) {
      operateBody
        .find("#ld")
        .css({
          left: leftData.x,
          top: leftData.y,
          width: leftData.w
        })
        .show();
      //动态计算线内容所在位置
      let leftDVDom = operateBody.find(".left-d-v");
      leftDVDom
        .css({
          left: (leftData.w - leftDVDom.width()) / 2
        })
        .text(_this.unitSize(leftData.w));
    }
  },

  /**
   * 隐藏iframe上显示信息的dom节点
   */
  hideIframeInfoDom: function() {
    this.hideHoverDom();
    this.hideChooseDom();
    this.hideDistance();
    this.hideChooseDistance();
    this.hideCompareDom();
    this.hideCompareImg();
  },

  /**
   * 隐藏标线
   */
  hideDistance: function() {
    let iframeBody = $("#screen")
        .contents()
        .find("body"),
      operateBody = $(".operate-dom-panel");
    operateBody.find("#td,#rd,#bd,#ld").hide();
  },
  /**
   *隐藏选中dom的长短信息
   */
  hideChooseDistance: function() {
    let iframeBody = $("#screen")
        .contents()
        .find("body"),
      operateBody = $(".operate-dom-panel");
    operateBody.find(".dom-width-val,.dom-height-val").hide();
  },
  /**
   * 清除移入样式
   */
  hideHoverDom: function() {
    let iframeBody = $("#screen")
        .contents()
        .find("body"),
      operateBody = $(".operate-dom-panel");
    operateBody.find(".rules").hide();
    iframeBody.find(".hover-dom-show").removeClass("hover-dom-show");
  },
  /**
   * 清除选中样式:给未选中的节点删除样式和属性
   */
  hideChooseDom: function() {
    let iframeBody = $("#screen")
        .contents()
        .find("body"),
      operateBody = $(".operate-dom-panel");
    operateBody.find(".choose-dom-style").hide();
    iframeBody.find(".choose-dom-show").removeClass("choose-dom-show");
  },
  /**
   * 隐藏对比工具
   */
  hideCompareDom: function() {
    $(".slider-compare-panel").hide();
  },
  /**
   * 隐藏对比设计稿
   */
  hideCompareImg: function() {
    $(".design-img-panel").hide();
  },
  /**
   * 显示右侧属性边框面板
   */
  showAttrPanel: function() {
    $(".attribute-show-panel")
      .removeClass("fadeOutRight")
      .addClass("slideInRight");
  },
  /**
   * 隐藏右侧属性边框面板
   */
  hideAttrPanel: function() {
    if (
      !$(".attribute-show-panel").hasClass("slideInRight") &&
      !$(".attribute-show-panel").hasClass("fadeOutRight")
    ) {
      return;
    }
    $(".attribute-show-panel")
      .removeClass("slideInRight")
      .addClass("fadeOutRight");
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
  /**
   * 判断是否是图片格式
   * @param imgurl
   * @returns {boolean}
   * @constructor
   */
  isImg: function(imgUrl) {
    let postfix = "";
    let index = imgUrl.indexOf("."); //得到"."在第几位
    postfix = imgUrl.substring(index); //截断"."之前的，得到后缀
    if (
      postfix != ".bmp" &&
      postfix != ".png" &&
      postfix != ".gif" &&
      postfix != ".jpg" &&
      postfix != ".jpeg"
    ) {
      //根据后缀，判断是否符合图片格式
      return false;
    } else {
      return true;
    }
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
      if (_this.isImg(imgPath)) {
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
      pageId: currentPageId,
      artboardId: currentArtboardId,
      pageArtBoardIndex: `${currentPageIndex + "_" + currentArtBoardIndex}`
    };
    /* console.log(
      "当前pageArtBoard序号:" +
        `${currentPageIndex + "_" + currentArtBoardIndex}`
    ); */
    //2018-10-10:请求页面骨架结构
    _this.pageAjaxFun(
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
        _this.bindIframeDom();

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
        //2018-10-10：请求图片资源
        _this.imgAjaxFun(
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
   *根据pageid、artboardId获取页面骨架数据方法
   * @param postData
   * @param successCallback
   * @param failCallback
   */
  pageAjaxFun: function(postData, successCallback, failCallback) {
    let pageAjax = CommonTool.httpRequest(
      "/edit/getPageById",
      postData,
      function(data) {
        successCallback(data);
      },
      function(error) {
        failCallback(error);
      }
    );
  },
  /**
   *根据pageid、artboardId获取页面图片方法
   * @param postData
   * @param successCallback
   * @param failCallback
   */
  imgAjaxFun: function(postData, successCallback, failCallback) {
    let imgAjax = CommonTool.httpRequest(
      "/edit/getPageImgById",
      postData,
      function(data) {
        successCallback(data);
      },
      function(error) {
        failCallback(error);
      }
    );
  },
  /**
   * 根据pageid、artboardId获取页面设计稿方法
   * @param postData
   * @param successCallback
   * @param failCallback
   */
  onlineUrlAjaxFun: function(postData, successCallback, failCallback) {
    let onlineUrlAjax = CommonTool.httpRequest(
      "/edit/getOnlineUrl",
      postData,
      function(data) {
        successCallback(data);
      },
      function(error) {
        failCallback(error);
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
