var vm = new Vue({
  el: "#personApp",
  data: {
    showNav: true,
    user: {},
    projects: [],
    historyProjects: []
  },
  created() {
    this.getUserInfo();
    this.getProjectList();
    this.getAllHistoryProjects();
  },
  computed: {
    countProgressStyle: function() {}
  },
  mounted: function() {},
  methods: {
    /**
     * 返回到首页
     */
    backIndex: function() {
      top.postMessage("/", "http://uitocode.oa.com");
    },
    /**
     * 返回个人中心
     */
    backCenter: function() {
      top.postMessage("/person", "http://uitocode.oa.com");
    },
    /**
     * 访问人数
     */
    visitorNum: function() {
      top.postMessage("/visitor", "http://uitocode.oa.com");
    },
    /**
     * 查看所有项目
     */
    viewProjects: function() {
      top.postMessage("/project", "http://uitocode.oa.com");
    },
    /**
     * 渲染个人信息
     */
    getUserInfo: function() {
      let _this = this;
      let userid = CommonTool.getCookie("staffid");
      let username = CommonTool.getCookie("staffname");
      //如果cookie里面有数据的话，则直接从cookie里面获取用户信息
      $.ajax({
        url: "/person/findStaff",
        type: "post",
        data: {
          staffid: userid
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
     * 展示公共项目
     * @param {*} event
     */
    showExampleDemo: function(event) {
      $(".page-demo").addClass("page-demo-display");
    },
    /**
     *  获取项目列表
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

          //this.nextTick(callback)，当数据发生变化，更新后执行回调。
          //this.$nextTick(callback)，当dom发生变化，更新后执行的回调。
          _this.$nextTick(function() {
            document.body.style.display = "block";
            $(".page-main .project-list-panel").show();
            //如果记录为0，则展示无项目样式
            if (res.data.length == 0) {
              $(".page-main .no-project-panel").show();
            }
          });
          //成功后的回调方法
          callback && callback(res.data);
        },
        error: function(data) {
          layer.msg("获取项目列表失败");
        }
      });
    },
    /**
     *  渲染浏览历史项目数据
     */
    getAllHistoryProjects: function() {
      let _this = this;
      $.ajax({
        url: "/person/getAllViewHistoryProjectById",
        type: "post",
        data: {
          userid: CommonTool.getCookie("staffid")
        },
        dataType: "json",
        success: function(res) {
          let historyData = res.data;
          if (!historyData) {
            historyData = [];
          }
          //console.dir(res.data);
          vm.historyProjects = historyData;

          _this.$nextTick(function() {
            document.body.style.display = "block";
            $(".page-main .history-list-panel").show();
          });

          //成功后的回调方法
          // callback && callback(res.data);
        },
        error: function(data) {
          layer.msg("获取项目列表失败");
        }
      });
    },
    /**
     * 创建项目
     */
    addProject: function(e) {
      let _this = this;
      //选择文件,获取文件信息
      let fileContent = $(e.srcElement).val();
      if (!fileContent) {
        return;
      }
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
          layer.msg("正在上传中", {
            time: 20000000
          });
          //只有sketch时，文件信息显示
          $(".file-info").show();
          //let msgIndex = layer.msg("正在上传中，请稍后...", {time: 30000});;

          let formData = new FormData($("#uploadForm")[0]); //表单id
          //在线上传
          //let onlineServer = "http://111.231.239.66:8080";
          //CommonTool.uploadFile(onlineServer+"/upload", formData, function (data) {
          CommonTool.uploadFile(
            "/person/upload",
            formData,
            function(data) {
              layer.msg(
                "创建项目中",
                {
                  shift: -1
                },
                function() {
                  //动态添加添加项目节点到页面上
                  /* _this.getProjectList(function(projectListData) {
                      layer.msg("创建项目成功");
                    }); */
                  //在最前方插入数据
                  vm.projects.unshift(data.projectData);
                  _this.$nextTick(function() {
                    layer.msg("创建项目成功");
                  });
                }
              );
            },
            function(error) {
              layer.msg("上传文件错误，请重试");
            }
          );
        } else {
          layer.msg("暂时只支持sketch文件格式");
        }
      } else {
        layer.msg("请上传文件");
      }
    },
    /**
     * 编辑项目
     * @param {*} url
     */
    editProject: function(projectId, projectName) {
      //window.location.href = url;
      top.postMessage(
        "/edit?id=" +
          projectId +
          "&name=" +
          encodeURIComponent(encodeURIComponent(projectName)),
        "http://uitocode.oa.com"
      );
    },
    /**
     * 删除项目
     * @param {*} event
     */
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
          var projectId = $(event.srcElement)
            .closest(".mask-wrap")
            .data("projectid");
          $.ajax({
            url: "/person/deleteProjectById",
            type: "post",
            data: {
              id: id,
              pid: projectId
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
    },
    /**
     * 查看项目详情
     */
    viewProjectById: function(event) {
      var projectId = $(event.srcElement).data("projectid");
      var projectName = $(event.srcElement).data("projectname");
      //点击查看项目详情
      //window.location.href = "/edit?id=" + projectId + "&name=" + projectName;
      top.postMessage(
        "/edit?id=" +
          projectId +
          "&name=" +
          encodeURIComponent(encodeURIComponent(projectName)),
        "http://uitocode.oa.com"
      );
    },
    /**
     * 删除历史记录
     * @param {*} event
     */
    deleteHistoryProjectById: function(event) {
      var that = this;
      layer.confirm(
        "确定删除此浏览记录吗？",
        {
          title: "提示",
          btn: ["确认", "取消"] //按钮
        },
        function() {
          var id = event.srcElement.id;
          var projectId = $(event.srcElement)
            .closest(".mask-wrap")
            .data("projectid");
          $.ajax({
            url: "/person/deleteHistoryById",
            type: "post",
            data: {
              id: id,
              pid: projectId
            },
            dataType: "json",
            success: function(res) {
              layer.closeAll();
              that.historyProjects.forEach(function(item, index) {
                if (item.id == id) {
                  that.historyProjects.splice(index, 1);
                }
              });
            },
            error: function(data) {}
          });
        },
        function() {}
      );
    },
    /**
     * 复制项目链接url
     * @param {*} event
     */
    copyUrl: function(event) {
      let clipboard = new ClipboardJS(".info");
      clipboard.on("success", function(e) {
        /* console.info("Action:", e.action);
        console.info("Text:", e.text);
        console.info("Trigger:", e.trigger); */
        e.clearSelection();
        layer.msg("复制链接成功");
      });
      clipboard.on("error", function(e) {
        //console.error("Action:", e.action);
        //console.error("Trigger:", e.trigger);
      });
    }
  }
});
