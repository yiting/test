let measure = {
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
    editUtil.hideDistance();
    //隐藏选中节点的宽高信息
    editUtil.hideChooseDistance();

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
        .text(unitSetting.unitSize(topData.h));
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
        .text(unitSetting.unitSize(rightData.w));
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
        .text(unitSetting.unitSize(bottomData.h));
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
        .text(unitSetting.unitSize(leftData.w));
    }
  }
};
