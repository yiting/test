$(function () {
    initPage();
    operatePage();
});

//文件类型
let fileType = '', fileUUID = ''
const operatePage = function (_this) {
    //选择文件,获取文件信息
    $('.choose-file-btn input').on('change', function (e) {
        let fileContent = $(this).val()
        if (!fileContent) {
            return
        }
        //清空上一次记录
        $('.upload-tips,.qr-code,.file-info,.result-panel,.no-result-info').hide()
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
        let file = e.currentTarget.files[0]
        //文件名称
        let name = file.name
        //alert(name.substr(name.lastIndexOf('/')+1))
        //文件大小
        let size = file.size
        //文件类型(api官方类型)
        // type = file.type;
        //根据文件名称来截取对应的类型后缀
        let potIndex = name.lastIndexOf('.')
        let fileName = name.substr(0, potIndex)
        fileType = name.substr(potIndex + 1).toUpperCase()
        fileType = fileType.toLowerCase()
        $('.file-name').text(name)
        $('.file-size').text(convert(size))
        //直接上传到后台
        if (fileType) {
            if (fileType == 'sketch') {
                layer.msg("正在上传中", {time: 20000000});
                //只有sketch时，文件信息显示
                $('.file-info').show()
                //let msgIndex = layer.msg("正在上传中，请稍后...", {time: 30000});;

                let formData = new FormData($('#uploadForm')[0])//表单id
                CommonTool.uploadFile("/upload", formData, function (data) {
                    layer.msg('正在解析中，请稍后', {shift: -1}, function () {
                        //结果区域显示
                        $('.result-panel').show()
                        $(".file-info").hide();
                        let fileUUID = data.uuid;
                        let fileName = data.filename;
                        //跳转到编辑页面
                        window.location.href = "/edit?id=" + fileUUID + "&name=" + fileName;
                    })

                    //把后台返回的结果，存入本地sessionStorage中，然后再edit页面中进行数据初始化
                    //获取html文件
                    //generateHtml(data)
                }, function (error) {
                    layer.msg('上传文件错误，请重试')
                });
            } else {
                //上传提示显示
                $('.upload-tips').show()
                layer.msg('暂时只支持sketch文件格式')
            }
        } else {
            //上传提示显示
            $('.upload-tips').show()
            layer.msg('请上传文件')
        }
    })

    //视频操作
    $('.play-video').on('click', function () {
        $('.video-wrap').show()
        $('.video-wrap')[0].offsetTop
        $('.video-wrap').addClass('on')
        $('#video')[0].play()
    })
    $('.play-close').on('click', function () {
        $('#video')[0].pause()
        $('.video-wrap').removeClass('on').hide()
    })
    $(window).on('scroll', function () {
        if (window.scrollY > 300) {
            $('#jmod-backtotop-wrap').css('visibility', 'visible')
        } else {
            $('#jmod-backtotop-wrap').css('visibility', 'hidden')
        }
    })

    //2018-08-03:滚动
    $('[id*=\'btn\']').stop(true).on('click', function (e) {
        e.preventDefault()
        //$(this).scrolld();
    })
    $('#jmod-backtotop-wrap').on('click', function () {
        $('html,body').animate({scrollTop: 0}, 300)
    })

}

/*获取html文件*/
const generateHtml = function (data) {
    //后台返回的url生成对应的链接和二维码
    generateURL(data)
}

/*后台返回的url生成对应的链接和二维码*/
const generateURL = function (data) {
    /*将返回结果先填充，并隐藏起来*/
    let resultJSON = JSON.parse(data)
    fileUUID = resultJSON.uuid
    //将生成uuid的文件
    //1.在线云服务
    //let resultURLSTR = "http://203.195.206.75:3000/" + resultJSON.uuid + ".html";
    //2.node服务(静态资源服务器)
    //let resultURLSTR = "http://192.168.1.102:6768/" + resultJSON.uuid + ".html";
    //let resultURLSTR = "http://192.168.1.102:3000/result/" + fileUUID + ".html";
    //公司电脑地址
    let resultURLSTR = 'http://127.0.0.1:3000/result/' + fileUUID + '/page-1.html'
    //腾讯云在线node服务
    //let resultURLSTR = 'http://tosee.oa.com/result/' + fileUUID + '.html'
    $('.result-url').text(resultURLSTR).attr('href', resultURLSTR)
    //将返回结果的url保存在浏览器storage中，便于用户关闭浏览器下次访问
    //保存标识
    let saveFlag = saveURL(resultURLSTR)
}

/*初始化页面数据*/
const initPage = function (_this) {
    if ('localStorage' in window && window['localStorage'] !== null) {
        let resultURL = localStorage.getItem('resultUrl')
        if (resultURL) {
            layer.msg('上次上传的文件已生成代码，请在页面底部上传区查看结果~')
            $('.result-url').text(resultURL).attr('href', resultURL)
            $('.upload-tips').hide()
            $('.result-panel').show()
        }
    }
}

/*将url存储在storage中*/
const saveURL = function (url) {
    try {
        if ('localStorage' in window && window['localStorage'] !== null) {
            localStorage.setItem('resultUrl', url)
            return true
        }
        return false
    }
    catch (e) {
        return false
    }
}

//文件大小换算
const convert = function (limit) {
    let size = ''
    if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
        size = limit.toFixed(2) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else { //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    let sizestr = size + ''
    let len = sizestr.indexOf('\.')
    let dec = sizestr.substr(len + 1, 2)
    if (dec == '00') {//当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
    }
    return sizestr
}