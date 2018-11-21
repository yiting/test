let AIService = function() {
  this.iframeBody = null;
  this.rateBtn = $(".ai-rate-btn");
  this.currentRateData = null;
  this.currentArtboardId = $(".artboard-list .artboard.active").data("id");
  //存放当前页面对应的AI rate数据
  this.rateDataArr = [];
};

AIService.prototype = {
  init: function() {
    this.eventListener();
    this.getDataByImg();
  },
  eventListener: function() {
    this.artBoardClick();
  },
  artBoardClick: function() {
    let that = this;
    //切换page
    $(".pages-list").on("change", ".pages-item input", function() {
      that.currentArtboardId = $(".artboard-list .artboard:first").data("id");
      that.rateBtn.data("show", 0).text("显示命中率");
    });
    //切换artboard
    $(".artboard-list").on("click", ".artboard", function() {
      that.currentArtboardId = $(this).data("id");
      that.rateBtn.data("show", 0).text("显示命中率");
    });
  },
  getDataByImg: function() {
    let that = this;
    //显示AI命中率:首先获取设计稿图，然后后台直接请求AI接口
    //1.走后台接口
    that.rateBtn.click(function() {
      let _this = $(this);
      let showPanelFlag = _this.data("show");
      //0:默认隐藏，点击显示命中率；1：已显示命中率，点击隐藏命中率面板
      if (showPanelFlag == 0) {
        //如果当前对象有AIData值的话，则不请求，直接从本地获取:从rateDataArr里面去获取
        let isRateExist = false,
          isRateExistData;
        that.rateDataArr.forEach(function(obj, i) {
          if (obj.artboardId == that.currentArtboardId) {
            isRateExist = true;
            isRateExistData = obj.artboardRateData;
          }
        });
        //如果AI模型数据已生成，则请求本地数据，不再请求AI后台接口
        if (isRateExist) {
          that.showRate(isRateExistData);
          return;
        }
        layer.msg("模型正在识别中...", {
          time: 200000
        });
        //请求后台数据
        let postData = {
          pageId: currentPageId,
          artboardId: currentArtboardId
        };
        //2018-10-12:请求设计稿当前artBoard的预览图
        CommonTool.httpRequest(
          "/edit/getAIData",
          postData,
          function(data) {
            //无论是否命中，都存储着
            that.rateDataArr.push({
              artboardId: that.currentArtboardId,
              artboardRateData: data
            });
            that.showRate(data);
          },
          function(error) {
            layer.msg("模型识别错误:" + error.responseText);
          }
        );
      } else if (showPanelFlag == 1) {
        //隐藏AI标注信息
        that.hideRate();
      }
    });
  },
  /**
   * 展示命中率
   */ showRate: function(currentRateData) {
    let that = this;
    //赋值给当前对象
    that.currentRateData = currentRateData;
    //关闭之前所有弹框
    layer.closeAll();
    //等待页面出来后，再获取iframe对象
    that.iframeBody = $("#screen")
      .contents()
      .find("body");
    //如果存在，则清除
    if (that.iframeBody.find(".rate-mask-panel").length > 0) {
      that.iframeBody.find(".rate-mask-panel").remove();
    }
    //如果未匹配到结果，则展示未命中模型
    if (currentRateData.length == 1) {
      let nonResult = currentRateData[0];
      if (nonResult == "none") {
        layer.msg("未命中模型");
        return;
      } else if (nonResult.errorCode == 0) {
        layer.msg(nonResult.errMsg);
        return;
      }
    }

    //上传图片大小:实际宽高
    let iframeW = $("#screen").width(),
      iframeH = $("#screen").height();
    //显示区域宽高
    let AIImgW = 750,
      AIImgH = 1334;
    //对应比例
    let AIScale = iframeW / AIImgW;

    let rateDomList = [],
      rateColorList = [
        "#0099CC",
        "#FF6666",
        "#FF6600",
        "#009999",
        "#FF6600",
        "#CC0066",
        "#CC3399"
      ],
      rateModelList = ["icon", "icondesc"];
    currentRateData.forEach((element, i) => {
      let rateObj = element;
      let {
        id: rateObjId,
        name: rateObjName,
        rate: rateObjRate,
        x: rateObjX,
        y: rateObjY,
        width: rateObjWidth,
        height: rateObjHeight
      } = rateObj;
      //当前命中模型的颜色
      let currentModelColor = rateColorList[rateModelList.indexOf(rateObjName)];
      rateDomList.push(
        `<div class="ai-rate-show ${rateObjName}" data-id=${rateObjId} style="position:absolute;left:${TOSEEAPP.unitSize(
          rateObjX * AIScale
        )};
       top:${TOSEEAPP.unitSize(iframeH - rateObjY * AIScale)};
       width:${TOSEEAPP.unitSize(rateObjWidth * AIScale)};
       height:${TOSEEAPP.unitSize(rateObjHeight * AIScale)};
       background-color:${currentModelColor};color:#fff;opacity:0.6;text-align:center;font-size:20px;box-shadow: 0 0 ${++i}px #000;z-index:${++i}">
       <div class="rate-model-name" style="position:absolute;left:0;top:0;color:${currentModelColor};font-size:20px;font-weight:bold;margin-top:-28px;">${rateObjName}</div>
       <div class="rate-model-rate" style="line-height:${TOSEEAPP.unitSize(
         rateObjHeight * AIScale
       )};">
       ${new Number(rateObjRate).toFixed(2)}</div>
       </div>`
      );
    });
    let ratePanel = `<div class="rate-mask-panel" style="position:absolute;left:0;top:0;">${rateDomList.join(
      ""
    )}</div>`;
    //添加标注节点在页面上
    that.iframeBody.append(ratePanel);
    //更改按钮信息
    that.rateBtn.data("show", 1).text("隐藏命中率");
  },
  /**
   * 隐藏命中率
   */
  hideRate() {
    this.rateBtn.data("show", 0).text("显示命中率");
    this.iframeBody.find(".rate-mask-panel").remove();
  }
};
