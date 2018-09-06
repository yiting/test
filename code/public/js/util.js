/**
 * Created by alltasxiao on 2018/8/23.
 */
/**
 * Created by alltasxiao on 2017/5/16.
 */
var CommonTool = {
    //获取当前时间
    getNowFormatDate: function () {
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
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds;
        return currentdate;
    },
    //网络请求公共方法
    uploadFile: function (actionUrl, param, callback, callbackError) {
        $.ajax({
            type: 'POST',
            //url: 'http://123.207.240.207:8089/' + actionUrl ,
            url: actionUrl,
            data: param,
            dataType: "json",
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                //根据返回结果进行操作
                callback(result);
            },
            error: function (error) {
                callbackError(error)
                console.log("请求错误")
            }
        });
    },
    httpRequest: function (actionUrl, param, callback, callbackError) {
        $.ajax({
            type: 'POST',
            url: actionUrl,
            data: param,
            dataType: "json",
            success: function (result) {
                //根据返回结果进行操作
                callback(result);
            },
            error: function (error) {
                callbackError(error)
                console.log("请求错误")
            }
        });
    }
};