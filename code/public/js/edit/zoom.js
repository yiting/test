class Zoom {
  constructor() {
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
      if (that.scale == that.minScale) {
        return;
      }
      that.scale -= that.eachStep;
      that.screenEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.zoomTxtEle.text(that.scale * 100 + "%");
    });
  }
  zoomOut() {
    let that = this;
    that.zoomOutBtn.on("click", function() {
      if (that.scale == that.maxScale) {
        return;
      }
      that.scale += that.eachStep;
      that.screenEle.css({
        transform: "scale(" + that.scale + ")",
        transition: "all .15s ease"
      });
      that.zoomTxtEle.text(that.scale * 100 + "%");
    });
  }
}
