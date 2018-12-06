//获取cookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
var data = GetRequest();
/* console.log("员工信息");
console.log(data.staffid);
console.log(data.staffname);
console.log(data.ChnName);
console.log(data.DeptName);
console.log("员工信息"); */

//如果cookie没有用户信息
var staffid = getCookie("staffid");
//走注册流程
if (!staffid) {
  $.ajax({
    url: "/login",
    type: "post",
    data: {
      staffid: data.staffid,
      staffname: data.staffname,
      ChnName: data.ChnName,
      DeptName: data.DeptName
    },
    dataType: "json",
    success: function (data) {
      console.dir(data);
      document.body.style.display = "block";
    },
    error: function (data) {
      alert("error");
    }
  });
} else {
  document.body.style.display = "block";
}
//如果cookie没有用户信息，直接进入

//文件类型
let fileType = "";
const operatePage = function () {
  //2018-11-12
  $("#nav-header-info,.btn-consult").click(function () {
    // window.location.href = "/person";
    top.postMessage("/person", "http://uitocode.oa.com");
  });
  $("#nav-structure-experience").click(function () {
    // window.location.href = "/person";
    top.postMessage("http://10.65.90.117:8080/#/check", "http://uitocode.oa.com");
  });
  $("#nav-img-experience").click(function () {
    // window.location.href = "/person";
    top.postMessage("http://10.65.95.52:8080/shitu", "http://uitocode.oa.com");
  });

  //视频操作
  $(".play-video").on("click", function () {
    $(".video-wrap").show();
    $(".video-wrap")[0].offsetTop;
    $(".video-wrap").addClass("on");
    $("#video")[0].play();
  });
  $(".play-close").on("click", function () {
    $("#video")[0].pause();
    $(".video-wrap")
      .removeClass("on")
      .hide();
  });
  $(window).on("scroll", function () {
    if (window.scrollY > 300) {
      $("#jmod-backtotop-wrap").css("visibility", "visible");
    } else {
      $("#jmod-backtotop-wrap").css("visibility", "hidden");
    }
  });

  //2018-08-03:滚动
  $("[id*='btn']")
    .stop(true)
    .on("click", function (e) {
      e.preventDefault();
      //$(this).scrolld();
    });
  $("#jmod-backtotop-wrap").on("click", function () {
    $("html,body").animate({
      scrollTop: 0
    }, 300);
  });
};