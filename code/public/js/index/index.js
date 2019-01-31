let TOSEEINDEX = {
  urlParams: CommonTool.GetRequest(),
  //获取cookie
  staffid: CommonTool.getCookie("staffid"),
  init: function() {
    this.login();
    this.eventListener();
  },
  /**
   * 注册流程
   */
  login: function() {
    let that = this;
    if (!that.staffid) {
      $.ajax({
        url: "/login",
        type: "post",
        data: {
          staffid: that.urlParams.staffid,
          staffname: that.urlParams.staffname,
          ChnName: that.urlParams.ChnName,
          DeptName: that.urlParams.DeptName
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
  },
  /**
   * 初始化页面监听事件
   */
  eventListener: function() {
    //2018-12-26:初始化用户信息
    $(".mod-header-user .avatar").css(
      "background-image",
      "url(http://dcloud.oa.com/Public/Avatar/" +
        CommonTool.getCookie("staffname") +
        ".png"
    );
    $(".mod-header-user .name").text(CommonTool.getCookie("staffname"));

    //$('.version-main').load('http://uitocode.oa.com/doc/version-cont.html');

    //2018-11-12
    $("#nav-header-info,.btn-consult").click(function() {
      // window.location.href = "/person";
      top.postMessage("/person", "http://uitocode.oa.com");
    });
    $("#nav-structure-experience").click(function() {
      // window.location.href = "/person";
      top.postMessage(
        "http://10.65.90.42:8080/#/check",
        "http://uitocode.oa.com"
      );
    });
    $("#nav-img-experience").click(function() {
      // window.location.href = "/person";
      top.postMessage(
        "http://10.64.67.35:8080/shitu",
        "http://uitocode.oa.com"
      );
    });

    //设计规范
    $(".design-standard").click(function(){
      window.open("/description");
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
      $("html,body").animate(
        {
          scrollTop: 0
        },
        300
      );
    });
  }
};
