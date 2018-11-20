let AIService = {
  getDataByImg() {
    //文件选择框，上传图片文件:change--->click:保证每次触发
    $("#upload-img").on("change", function(e) {
      //如果没有内容，则返回
      let fileContent = $(this).val();
      if (!fileContent) {
        layer.msg("未上传图片，请重新上传!");
        return;
      }
      let formData = new FormData();
      formData.append("file", $("#upload-img")[0].files[0]); //添加图片信息的参数
      /* CommonTool.uploadFile("/edit/uploadAIImg", formData, function(data) {
          layer.msg("上传图片成功，AI服务正在解析中...");
          //console.log(data)
          //上传成功后，获取图片地址url。请求AI服务地址(可以在后台进行，拿到的数据，直接结合俊标模型规则，进行组装页面)
        }); */

      layer.msg("AI结果正在获取中...", {
        time: 200000
      });
      CommonTool.AIRequest("/upload/image/", formData, function(data) {
        layer.msg("AI返回结果:" + data);
        return data;
        //console.log(data)
        //上传成功后，获取图片地址url。请求AI服务地址(可以在后台进行，拿到的数据，直接结合俊标模型规则，进行组装页面)
      });
    });
  }
};
