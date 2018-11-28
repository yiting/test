var vm = new Vue({
  el: "#visitorApp",
  data: {
    showNav: false,
    user: {},
    visitor: {},
    visitors: []
  },
  filters: {
    //格式化时间
    formatDate(time) {
      var date = new Date(time);
      return CommonTool.formatDate(date);
    }
  },
  created() {
    this.getUserInfo();
    this.getVisitorList();
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
     * 渲染个人信息
     */
    getUserInfo: function() {
      let _this = this;
      let userid = CommonTool.getCookie("staffid");
      let username = CommonTool.getCookie("staffname");
      //如果cookie里面有数据的话，则直接从cookie里面获取用户信息
      if (userid && username) {
        _this.user = {
          staffid: userid,
          staffname: username
        };
      } else {
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
      }
    },
    /**
     *  获取访客列表
     */
    getVisitorList: function(callback) {
      let _this = this;
      $.ajax({
        url: "/visitor/getAllVisitors",
        type: "post",
        data: {
          userid: CommonTool.getCookie("staffid")
        },
        dataType: "json",
        success: function(res) {
          //console.dir(res.data);
          let visitorList = res.data;
          visitorList.forEach(function(item, index) {
            if (item.staffid == CommonTool.getCookie("staffid")) {
              visitorList.splice(index, 1);
            }
          });

          vm.visitors = visitorList;
          //成功后的回调方法
          callback && callback(res.data);
        },
        error: function(data) {
          layer.msg("获取访客列表失败");
        }
      });
    }
  }
});
