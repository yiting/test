/**
 * Created by alltasxiao on 2018/8/23.
 */
/**
 * Created by alltasxiao on 2017/5/16.
 */
var CommonTool = {
  /**
   * 获取cookie
   * @param {*} c_name
   */
  getCookie: function(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  },
  //获取当前时间
  getNowFormatDate: function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate =
      date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate +
      " " +
      hours +
      seperator2 +
      minutes +
      seperator2 +
      seconds;
    return currentdate;
  },
  //文件大小换算
  convert: function(limit) {
    let size = "";
    if (limit < 0.1 * 1024) {
      //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
    } else if (limit < 0.1 * 1024 * 1024) {
      //如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizestr = size + "";
    let len = sizestr.indexOf(".");
    let dec = sizestr.substr(len + 1, 2);
    if (dec == "00") {
      //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  },
  //Es6 + ES5去重办法
  ES6duplicate: function(arr, attr) {
    if (arr.length == 0) {
      return arr;
    } else {
      if (attr) {
        var obj = {};
        var newArr = arr.reduce((cur, next) => {
          obj[next[attr]] ? "" : (obj[next[attr]] = true && cur.push(next));
          return cur;
        }, []);
        return newArr;
      } else {
        return Array.from(new Set(arr));
      }
    }
  },
  //网络请求公共方法
  uploadFile: function(actionUrl, param, callback, callbackError) {
    $.ajax({
      type: "POST",
      //url: 'http://123.207.240.207:8089/' + actionUrl ,
      url: actionUrl,
      data: param,
      dataType: "json",
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(result) {
        //根据返回结果进行操作
        callback(result);
      },
      error: function(error) {
        callbackError(error);
        console.log("请求错误");
      }
    });
  },
  //AI请求方法
  AIRequest: function(actionUrl, param, callback, callbackError) {
    let _this = this;
    $.ajax({
      type: "POST",
      url: TOSEESERVICE.AI + actionUrl,
      data: param,
      dataType: "text",
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      success: function(result) {
        result = _this.AIDataHandle(result);
        //根据返回结果进行操作
        callback(result);
      },
      error: function(error) {
        callbackError(error);
        console.log("请求错误");
      }
    });
  },
  /**
   * 处理AI数据
   * @param {*} AIData
   */
  AIDataHandle: function(AIData) {
    AIData = AIData.split(/\s/);
    var arr = [];
    for (let i in AIData) {
      let AIOne = AIData[i];
      let AIOneArr = AIOne.split(";");
      let AIOneArrFirst = AIOneArr[0].split(":");
      //第一个元素
      let o = {
        id: new Date().getTime(),
        name: AIOneArrFirst[0],
        rate: AIOneArrFirst[1]
      };
      arr.push(o);
    }
    console.log(arr);
    return arr;
  },
  /**
   * 普通网络请求方法
   * @param {*} actionUrl
   * @param {*} param
   * @param {*} callback
   * @param {*} callbackError
   */
  httpRequest: function(actionUrl, param, callback, callbackError) {
    let ajaxObj;
    if (ajaxObj != null) ajaxObj.abort();
    ajaxObj = $.ajax({
      type: "POST",
      url: actionUrl,
      data: param,
      dataType: "json",
      success: function(result) {
        if (result.length == 0) return true;
        //根据返回结果进行操作
        callback(result);
      },
      error: function(error) {
        callbackError(error);
        console.log("请求错误");
      }
    });

    return ajaxObj;
  }
};
