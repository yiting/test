/**
 * 获取用户名、用户头像
 */
var vm = new Vue({
  el: "#app",
  data: {
    user: {
      staffid: CommonTool.getCookie("staffid") || "",
      staffname: CommonTool.getCookie("staffname") || ""
    }
  },
  computed: {
    countProgressStyle: function() {}
  },
  methods: {
    goStandard: function() {
      //top.postMessage("/description", "http://uitocode.oa.com");
      window.open("/description");
    }
  }
});
