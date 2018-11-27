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

let HistoryService = function() {};
HistoryService.prototype = {
  init: function() {
    this.saveHistory();
  },
  //存储历史记录
  saveHistory: function() {
    //071a4340-eef5-11e8-9da5-cdb1e265e5d4
    var id = data.id;
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
