//2018-11-20
let AIImgData;
router.post("/getAIData", function(req, res, next) {
  //console.log("获取当前artboard预览图片请求");
  logger.debug("[edit.js-getAIData]获取当前artboard预览图片对应的AI数据");
  //根据artBoardId来获取对应的缩略图,返回url地址到页面上
  //getImgsPrew(req.body.artboardId);
  let artBoardID = req.body.artboardId;
  let artBoardImgName = artBoardID + ".png";
  let artBoardObj = {
    path: artBoardImgName,
    _origin: {
      do_objectID: artBoardID
    }
  };
  Promise.all([getArtBoardImg(artBoardObj)]).then(info => {
    //再次请求数据到AI
    var formData = {
      // Pass a simple key-value pair
      my_field: "my_value",
      // Pass data via Buffers
      my_buffer: new Buffer([1, 2, 3]),
      // Pass data via Streams
      file: fs.createReadStream(
        "./data/complie/" + projectName + "/images/" + artBoardImgName
        //__dirname + "/" + artBoardImgName
      )
    };
    requestHttp.post(
      {
        url: ControllerUtils.AIServiceUrl + "/upload/image",
        formData: formData
      },
      function optionalCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
          AIImgData = ControllerUtils.AIDataHandle(body);
        } else {
          AIImgData = [
            {
              errCode: 0,
              errMsg: "获取AI结果错误"
            }
          ];
        }
        //将AI结果返回
        res.json(AIImgData);
        //AI结果作为俊标和Yone，算法模型+AI模型的数据来源
      }
    );
  });
});