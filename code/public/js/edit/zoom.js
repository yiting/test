class Zoom {
  constructor() {
    this.compareImgEle = $(".design-img-panel");
    this.measureEle = $(".operate-dom-panel");
    this.screenEle = $(".screen");
    this.zoomInBtn = $(".zoom-in");
    this.zoomTxtEle = $(".zoom-text");
    this.zoomOutBtn = $(".zoom-out");
    this.scale = 1;
    this.minScale = 0.5;
    this.maxScale = 3;
    this.eachStep = 0.25;
    this.init();
  }
  init() {
    this.eventListener();
  }
  eventListener() {
    this.zoomIn();
    this.zoomOut();
  }
  zoomIn() {
    let that = this;
    that.zoomInBtn.on("click", function() {
      that.initZoomBtn();
      //最小值，则不能继续减小
      if (that.scale == that.minScale) {
        return;
      }
      that.scale -= that.eachStep;
      that.screenEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.compareImgEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.measureEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.zoomTxtEle.text(that.scale * 100 + "%");
      //实时监听值大小
      if (that.scale == that.minScale) {
        that.zoomInBtn.attr("disabled", true);
      }
    });
  }
  zoomOut() {
    let that = this;
    that.zoomOutBtn.on("click", function() {
      that.initZoomBtn();
      if (that.scale == that.maxScale) {
        return;
      }
      that.scale += that.eachStep;
      that.screenEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.compareImgEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.measureEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.zoomTxtEle.text(that.scale * 100 + "%");
      //实时监听值大小
      if (that.scale == that.maxScale) {
        that.zoomOutBtn.attr("disabled", true);
      }
    });
  }
  initZoomBtn() {
    this.zoomInBtn.attr("disabled", false);
    this.zoomOutBtn.attr("disabled", false);
  }
}
