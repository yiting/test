export default `<!DOCTYPE html>
<html lang="zh-cmn-Hans" data-use-rem="750" style="font-size: 50px;">

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
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="index.css" />
</head>

<body ontouchstart>
  %{htmlStr}
  <div class="test-bar">
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
      var className = document.body.className.split(' '),
        checked = target.checked,
        value = target.value;

      if (target.checked && !className.includes(value)) {
        className.push(value);
      }
      if (!target.checked && className.includes(value)) {
        className = className.filter(c => c != value);
      }
      document.body.className = className.join(' ');

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
