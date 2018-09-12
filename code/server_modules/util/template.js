// template.js 用于生成各模板相关字符串


// h5头
let html5 = function(cssName) {
    let str = '<!DOCTYPE html>'
            + '<html data-use-rem="750">'
            + '<head>'
            + '<meta charset="utf-8">'
            + '<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">'
            + '<title></title>'
            + '<link rel="stylesheet" href="'+cssName+'.css">'
            + '<script src="http://imgcache.qq.com/push/js/grid.js"></script>'
            + '<script src="https://open.mobile.qq.com/sdk/qqapi.js?_bid=152"></script>'
            + '</head>';

    return str;
}


let end = function() {
    // let str = '<script src="https://coderjunb.github.io/Contrast/dist/contrast.js"></script>'
    //         + '<script>Contrast.setBg({src: "./images/bg.png"});</script>'
    //         + '</html>';
    let str = '</html>';

    return str;
}


module.exports={
    html5,
    end
}