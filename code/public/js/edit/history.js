let HistoryService = function() {
  this.urlParams = CommonTool.GetRequest();
};
HistoryService.prototype = {
  init: function() {
    this.saveHistory();
  },
  //存储历史记录
  saveHistory: function() {
    var id = this.urlParams.id;
    var staffid = CommonTool.getCookie("staffid");
    if (!staffid) {
      return;
    }
    //记录一次浏览记录
    $.ajax({
      url: "/edit/createViewhistory",
      type: "post",
      data: {
        userid: staffid,
        projectId: id
      },
      dataType: "json",
      success: function(data) {
        // console.dir(data);
      },
      error: function(data) {
        // alert("error");
      }
    });
  }
};
