export default (
  htmlStr: string,
  option: {
    designWidth: number;
  },
) => `<!DOCTYPE html>
<html lang="zh-cmn-Hans" data-use-rem="${option.designWidth}">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport"
    content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0, user-scalable=no,viewport-fit=cover" />
  <meta name="format-detection" content="telephone=no, email=no" />
  <meta name="HandheldFriendly" content="true" />
  <meta name="MobileOptimized" content="320" />
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <meta name="Description" content="Tencent,腾讯" />
  <meta name="Keywords" content="Tencent,腾讯" />
  <meta itemprop="name" content="" />
  <meta name="description" itemprop="description" content="" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="" />
  <meta name="apple-mobile-web-app-status-bar-style" content="white" />
  <title></title>
  <style>
    *{
      margin:0;
      padding:0;
      list-style:none
    }
    .test-bar{
      position:fixed;
      bottom:0;
      left:0;
      font-size:12px;
      line-height:20px;
      background-color:rgba(255,255,255,.5);
    }
    .test-bar label{
      display:block;
    }
    .test-image [class^="image"]{
      background-color:rgba(255,0,0,.2);
    }
    .test-default .wrap *{
      background-color:rgba(0,0,0,.2);
      color:transparent!important;
    }
  </style>
  <link rel="stylesheet" href="index.css" />
</head>

<body ontouchstart>
  ${htmlStr}
  <div class="test-bar">
    <label><input type="checkbox" value="image" onchange="change_css(event)">Image</label>
    <label><input type="checkbox" value="text" onchange="change_css(event)">Text</label>
    <label><input type="checkbox" value="default" onchange="change_css(event)">Default</label>
    <label><input type="checkbox" value="element" onchange="change_css(event)">Element</label>
    <label><input type="checkbox" value="widget" onchange="change_css(event)">Widget</label>
    <label><input type="checkbox" value="cycle" onchange="change_css(event)">Cycle</label>
    <label><input type="checkbox" value="similar" onchange="change_css(event)">Similar</label>
    <label><input type="checkbox" value="layer" onchange="change_css(event)">Layer</label>
  </div>
  <script src="https://coderjunb.github.io/Contrast/dist/contrast.js"></script>
  <script>
    Contrast.setBg({
      src: "bg.png"
    });
  </script>
  <script type="text/javascript">
    function change_css(evt) {
      var target = evt.target;
      var checked = target.checked,
        value = 'test-'+target.value;

      if (target.checked) {
        document.body.classList.add(value);
      }
      if (!target.checked) {
        document.body.classList.remove(value);
      }
    };
    (function (win) {
      var doc = win.document,
        html = doc.documentElement,
        option = html.getAttribute("data-use-rem");
      if (option === null) return;
      var baseWidth =
        parseInt(option).toString() === "NaN" ? 750 : parseInt(option),
        resizeEvt =
        "orientationchange" in win ? "orientationchange" : "resize",
        recalc = function () {
          var clientWidth = html.clientWidth || 375;
          html.style.fontSize = (100 * clientWidth) / baseWidth + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(window);
  </script>
</body>

</html>`;
