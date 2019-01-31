/**
 * 各端单位切换
 */
let TOSEEConfig = {
  scale: "56",
  unit: "rem",
  zoom: 1
};

let editUtil = {
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
    this.hideAttrPanel();
    this.closeImgViewer();
    this.initCompareBtn();
  },
  /**
   * 初始化比对按钮状态
   */
  initCompareBtn: function() {
    $(".show-notes input[type='checkbox']").attr("checked", false);
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
   * 关闭图片查看器
   */
  closeImgViewer: function() {
    //关闭图片查看器
    $(".magnify-modal").remove();
    $(".img-item-list").html("");
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
  /**
   * 图片路径
   * @param {*} url
   * @param {*} callback
   */
  getImgToBase64: function(url, callback) {
    let canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  },
  //将base64转换为文件对象
  dataURLtoFile: function(dataurl, filename) {
    var arr = dataurl.split(",");
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    //转换成file对象
    return new File([u8arr], filename, { type: mime });
    //转换成成blob对象
    //return new Blob([u8arr],{type:mime});
  }
};
