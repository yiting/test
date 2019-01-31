let iframeDom = {
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
          positionX = unitSetting.unitSize(positionXReal);

          positionYReal = hoverElement.offset().top;
          positionY = unitSetting.unitSize(positionYReal);

          //获取当前的padding:padding-left、padding-right、padding-top、padding-bottom
          ElementPTReal = parseFloat(
            hoverElement.css("padding-top").replace("px", "")
          );
          ElementPT = unitSetting.unitSize(ElementPTReal);

          ElementPRReal = parseFloat(
            hoverElement.css("padding-right").replace("px", "")
          );
          ElementPR = unitSetting.unitSize(ElementPRReal);

          ElementPBReal = parseFloat(
            hoverElement.css("padding-bottom").replace("px", "")
          );
          ElementPB = unitSetting.unitSize(ElementPBReal);

          ElementPLReal = parseFloat(
            hoverElement.css("padding-left").replace("px", "")
          );
          ElementPL = unitSetting.unitSize(ElementPLReal);

          ElementWidthReal = parseFloat(
            hoverElement.css("width").replace("px", "")
          );
          ElementWidth = unitSetting.unitSize(ElementWidthReal);

          ElementHeightReal = parseFloat(
            hoverElement.css("height").replace("px", "")
          );
          ElementHeight = unitSetting.unitSize(ElementHeightReal);

          //去除其他
          editUtil.hideHoverDom();
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
          measure.measureDistance();
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
        editUtil.hideHoverDom();
        //隐藏测距样式
        editUtil.hideDistance();
        //选中节点后，弹出右侧属性边框面板
        editUtil.showAttrPanel();
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
          editUtil.hideChooseDom();
          //初始化隐藏测距dom
          editUtil.hideDistance();
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
          if (ElementClass.includes("img") || ElementClass.includes("icon")) {
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
            let ElementFontSize = unitSetting.unitSize(ElementFontSizeReal);

            let ElementLetterSpaceReal = chooseElement.css("letter-space")
              ? parseFloat(chooseElement.css("letter-space").replace("px", ""))
              : 0;
            let ElementLetterSpace = unitSetting.unitSize(
              ElementLetterSpaceReal
            );

            let ElementLineHeightReal = parseFloat(
              chooseElement.css("line-height").replace("px", "")
            );
            let ElementLineHeight = unitSetting.unitSize(ElementLineHeightReal);
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
        editUtil.hideChooseDom();
        //2.去掉移入样式
        editUtil.hideHoverDom();
        //3.初始化隐藏测距dom
        editUtil.hideDistance();
        //4.选中面板其他区域，隐藏右侧属性边框面板
        editUtil.hideAttrPanel();
      });
    });
  }
};
