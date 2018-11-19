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
    success: function(data) {
      console.dir(data);
      document.body.style.display = "block";
    },
    error: function(data) {
      alert("error");
    }
  });
} else {
  document.body.style.display = "block";
}
//如果cookie没有用户信息，直接进入

//文件类型
let fileType = "";
const operatePage = function() {
  //2018-11-12
  $("#nav-header-info,.btn-consult").click(function() {
    window.location.href = "/person";
  });

  //选择文件,获取文件信息
  $(".choose-file-btn input").on("change", function(e) {
    let fileContent = $(this).val();
    if (!fileContent) {
      return;
    }
    //清空上一次记录
    $(".upload-tips,.qr-code,.file-info,.no-result-info").hide();
    //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
    let file = e.currentTarget.files[0];
    //文件名称
    let name = file.name;
    //alert(name.substr(name.lastIndexOf('/')+1))
    //文件大小
    let size = file.size;
    //文件类型(api官方类型)
    // type = file.type;
    //根据文件名称来截取对应的类型后缀
    let potIndex = name.lastIndexOf(".");
    let fileName = name.substr(0, potIndex);
    fileType = name.substr(potIndex + 1).toUpperCase();
    fileType = fileType.toLowerCase();
    $(".file-name").text(name);
    $(".file-size").text(convert(size));
    //直接上传到后台
    if (fileType) {
      if (fileType == "sketch") {
        layer.msg("正在上传中", { time: 20000000 });
        //只有sketch时，文件信息显示
        $(".file-info").show();
        //let msgIndex = layer.msg("正在上传中，请稍后...", {time: 30000});;

        let formData = new FormData($("#uploadForm")[0]); //表单id
        //在线上传
        //let onlineServer = "http://111.231.239.66:8080";
        //CommonTool.uploadFile(onlineServer+"/upload", formData, function (data) {
        CommonTool.uploadFile(
          "/upload",
          formData,
          function(data) {
            layer.msg("正在解析中，请稍后", { shift: -1 }, function() {
              //结果区域显示
              $(".file-info").hide();
              let fileUUID = data.uuid;
              let fileName = data.filename;
              //跳转到编辑页面
              window.location.href =
                "/edit?id=" + fileUUID + "&name=" + fileName;
            });
          },
          function(error) {
            layer.msg("上传文件错误，请重试");
          }
        );
      } else {
        //上传提示显示
        $(".upload-tips").show();
        layer.msg("暂时只支持sketch文件格式");
      }
    } else {
      //上传提示显示
      $(".upload-tips").show();
      layer.msg("请上传文件");
    }
  });

  //视频操作
  $(".play-video").on("click", function() {
    $(".video-wrap").show();
    $(".video-wrap")[0].offsetTop;
    $(".video-wrap").addClass("on");
    $("#video")[0].play();
  });
  $(".play-close").on("click", function() {
    $("#video")[0].pause();
    $(".video-wrap")
      .removeClass("on")
      .hide();
  });
  $(window).on("scroll", function() {
    if (window.scrollY > 300) {
      $("#jmod-backtotop-wrap").css("visibility", "visible");
    } else {
      $("#jmod-backtotop-wrap").css("visibility", "hidden");
    }
  });

  //2018-08-03:滚动
  $("[id*='btn']")
    .stop(true)
    .on("click", function(e) {
      e.preventDefault();
      //$(this).scrolld();
    });
  $("#jmod-backtotop-wrap").on("click", function() {
    $("html,body").animate({ scrollTop: 0 }, 300);
  });
};

//文件大小换算
const convert = function(limit) {
  let size = "";
  if (limit < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  let sizestr = size + "";
  let len = sizestr.indexOf(".");
  let dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
};
