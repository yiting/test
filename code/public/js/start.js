
var toseeIframe=$("#toseeIframe");
function test(){
  var data={
    ChnName:"唐斌",
    DeptNameString:"PCG平台与内容事业群/xxxx/xxxxx/xxxx/xxxx/ui开发组", 
  }
  //获取用户其他的数据
  var staffPath=$("#staff").val();
  staffPath+='&ChnName='+data.ChnName;
  staffPath+='&DeptName='+data.DeptNameString;
  toseeIframe.attr('src',staffPath)
}
//test();

function goIframe(){
  //获取data
  $.ajax({
    url: "/ts:auth/tauth/info.ashx",
    success: function(data){
      var staffPath=$("#staff").val();
      staffPath+='&ChnName='+data.ChnName;
      staffPath+='&DeptName='+data.DeptNameString;
      toseeIframe.attr('src',staffPath)
    }
  })
}

