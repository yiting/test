var vm = new Vue({
  el: "#projectApp",
  data: {
    showNav: true,
    user: {},
    projects: []
  },
  created() {
    this.getUserInfo();
    this.getAllProjects();
  },
  computed: {
    countProgressStyle: function() {}
  },
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
     *  渲染所有项目
     */
    getAllProjects: function(callback) {
      let _this = this;
      $.ajax({
        url: "/project/getAllProjects",
        type: "post",
        dataType: "json",
        success: function(res) {
          if (!res.data) {
            res.data = [];
          }
          //console.dir(res.data);
          vm.projects = res.data;
          document.body.style.display = "block";
          //成功后的回调方法
          // callback && callback(res.data);
        },
        error: function(data) {
          layer.msg("获取所有项目列表失败");
        }
      });
    },
    /**
     * 查看所有项目
     */
    viewProjects: function() {
      top.postMessage("/project", "http://uitocode.oa.com");
    },
    /**
     * 编辑项目
     * @param {*} url
     */
    editUrl: function(url) {
      //window.location.href = url;
      top.postMessage(url, "http://uitocode.oa.com");
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
        "/edit?id=" + projectId + "&name=" + projectName,
        "http://uitocode.oa.com"
      );
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
     * 复制链接url
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
