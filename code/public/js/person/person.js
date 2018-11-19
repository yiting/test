var vm = new Vue({
  el: "#app",
  data: {
    user: {},
    projects: []
  },
  computed: {
    countProgressStyle: function() {}
  },
  methods: {
    /**
     * 编辑项目
     * @param {*} url
     */
    editUrl: function(url) {
      window.location.href = url;
    },
    /**
     * 查看项目详情
     */
    viewProjectById: function(event) {
      var projectId = $(event.srcElement).data("projectid");
      var projectName = $(event.srcElement).data("projectname");
      //点击查看项目详情
      window.location.href = "/edit?id=" + projectId + "&name=" + projectName;
    },
    deleteProjectById: function(event) {
      var that = this;
      layer.confirm(
        "确定删除此项目吗？",
        {
          title: "提示",
          btn: ["确认", "取消"] //按钮
        },
        function() {
          var id = event.srcElement.id;
          $.ajax({
            url: "/person/deleteProjectById",
            type: "post",
            data: {
              id: id
            },
            dataType: "json",
            success: function(res) {
              layer.closeAll();
              that.projects.forEach(function(item, index) {
                if (item.id == id) {
                  that.projects.splice(index, 1);
                }
              });
            },
            error: function(data) {}
          });
        },
        function() {}
      );
    }
  }
});

let PersonApp = {
  init: function() {
    this.getUserInfo();
    this.getProjectList();
    this.addProject();
    //this.viewProjectById();
  },
  /**
   * 渲染个人信息
   */
  getUserInfo: function() {
    let _this = this;
    $.ajax({
      url: "/person/findStaff",
      type: "post",
      data: {
        staffid: CommonTool.getCookie("staffid")
      },
      dataType: "json",
      success: function(res) {
        if (res.code == 0) {
          vm.user = res.data[0] || {};
          //console.dir(vm);
        }
      },
      error: function(data) {
        layer.msg("获取个人信息失败");
      }
    });
  },
  /**
   *  渲染项目数据
   */
  getProjectList: function(callback) {
    let _this = this;
    $.ajax({
      url: "/person/getAllProjectById",
      type: "post",
      data: {
        userid: CommonTool.getCookie("staffid")
      },
      dataType: "json",
      success: function(res) {
        //console.dir(res.data);
        vm.projects = res.data;
        document.body.style.display = "block";
        //成功后的回调方法
        callback && callback(res.data);
      },
      error: function(data) {
        layer.msg("获取项目列表失败");
      }
    });
  },
  /**
   * 创建项目
   */
  addProject: function() {
    let _this = this;
    //选择文件,获取文件信息
    $(".choose-file-input").on("change", function(e) {
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
      $(".file-size").text(CommonTool.convert(size));
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
              layer.msg("创建项目中", { shift: -1 }, function() {
                //结果区域显示
                $(".file-info").hide();
                let fileUUID = data.uuid;
                let fileName = data.filename;
                //动态添加添加项目节点到页面上
                _this.getProjectList(function(projectListData) {
                  layer.msg("创建项目成功");
                });
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
  },
  /**
   * 查看项目详情
   */
  viewProjectById: () => {
    //点击查看项目详情
    $(".resource-list").on("click", ".resource-item", function() {
      let _thisProItem = $(this).find(".resource-item__inner");
      let _thisProId = _thisProItem.data("pid");
      let _thisProName = _thisProItem.data("pname");
      window.location.href = "/edit?id=" + _thisProId + "&name=" + _thisProName;
    });
  },
  /**
   * 添加项目节点dom到页面中
   * @param {*} projectId
   * @param {*} projectName
   */
  addProjectDom: function(projectId, projectName) {
    let projectDom = ``;
  }
};

//2018-11-12
$(function() {
  PersonApp.init();
});

//个人中心
//拿到全部个人数据
// function GetRequestParam() {
//    var url = location.search; //获取url中"?"符后的字串
//    var theRequest = new Object();
//    if (url.indexOf("?") != -1) {
//       var str = url.substr(1);
//       strs = str.split("&");
//       for(var i = 0; i < strs.length; i ++) {
//          theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
//       }
//    }
//    return theRequest;
// }
// var data=GetRequestParam();
// console.log("员工信息")
// console.log(data.staffid)
// console.log(data.staffname)
// console.log(data.ChnName)
// console.log(data.DeptName)
// console.log("员工信息")

//存储到数据库
// 登陆操作
// $.ajax({
//   url: '/users/userInset',
//   type: 'post',
//   data:{
//     staffid:data.staffid,
//     staffname:data.staffname,
//     ChnName:data.ChnName,
//     DeptName:data.DeptName
//   },
//   dataType: 'json',
//   success:function(data){
//     console.dir(data)
//   },
//   error:function(data){
//     // alert('error');
//   }
// });
