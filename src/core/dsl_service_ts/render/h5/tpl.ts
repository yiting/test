export default `<!DOCTYPE html>
<html lang="zh-cmn-Hans" data-use-rem="750">

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
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="cssFilePath" class="contentCss" />
  <style style="display:none">
    * {
      -webkit-touch-callout:none;
      -webkit-user-select:none;
      -khtml-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
    }
  </style>
</head>

<body ontouchstart>
  %{htmlStr}
  <script type="text/javascript">
    (function (win) {
      var doc = win.document,
        html = doc.documentElement,
        option = html.getAttribute("data-use-rem");
      if (option === null) return;
      var baseWidth =
        parseInt(option).toString()==="NaN" ? 750 : parseInt(option),
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
