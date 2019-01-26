/**
 * 比对操作
 */
class Compare {
  constructor() {
    this.zoomInstance = new Zoom();
    this.areaBtn = "";
    this.opacityBtn = "";
    this.designImgEle = $("#design-img-prew");
    this.measureEle = $(".operate-dom-panel");
    this.init();
  }
  init() {
    this.initStatus();
    this.eventListener();
  }
  initStatus() {
    this.designImgEle.css({
      opacity: "0.5",
      "clip-path": "inset(0 50% 0 0)"
    });
  }
  //操作区域
  eventListener() {
    let that = this;
    //遮罩宽度设置
    var areaSlider = $("#area-slider")
      .slider({
        formatter: function(value) {
          return "宽度: " + value + "%";
        }
      })
      .data("slider");
    areaSlider.on("slide", function(e) {
      let currentAreaVal = areaSlider.getValue();
      let maskWidth = 100 - currentAreaVal;
      that.setArea(that.designImgEle, maskWidth);
    });

    areaSlider.on("slideStart", function(e) {
      //滑动开始，不可以穿透
      that.measureEle.css({
        "pointer-events": "auto"
      });
    });
    areaSlider.on("slideStop", function(e) {
      //滑动停止，可穿透
      that.measureEle.css({
        "pointer-events": "none"
      });
    });

    //透明度设置
    let opacitySlider = $("#opacity-slider")
      .slider({
        formatter: function(value) {
          return "透明度: " + value + "%";
        },
        reversed : true
      })
      .data("slider");
    opacitySlider.on("slide", function(e) {
      //console.log(opacitySlider.getValue());
      let currentOpacityVal = opacitySlider.getValue() / 100;
      that.setOpacity(that.designImgEle, currentOpacityVal);
    });
  }
  setArea(obj, maskWidth) {
    obj.css("clip-path", "inset(0 " + maskWidth + "% 0 0)");
  }
  setOpacity(obj, opacity) {
    obj.css("opacity", opacity);
  }
}
