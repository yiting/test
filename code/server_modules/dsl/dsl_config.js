module.exports.create = function (designWidth) {
    let width, // 设计稿宽
        verticalSpacing, // 垂直间距，小于间距为一组
        horizontalSpacing, // 水平间距，小于间距为一组
        // horizontalCrack, // 水平缝隙
        navbarHeight, // 导航高度
        unit, // 设计长度单位
        fontSize, // 字体基础大小
        dpr, // 设备像素比 Device Pixel Ratio
        lineHeight = 1.1, // 默认行高
        textSpacingCoefficient = 1 / 1.4, // 文案空间误差系数
        segmentingCoefficient = .7, // 分割线比例系数
        segmentingVerticalWidth = 2, // 垂直分割线宽度
        operateErrorCoefficient = 4 // 操作误差值，3像素操作误差+1像素行高清洗误差
    switch (designWidth + '') {
        case "1080":
            {
                // 基于安卓设计
                width = 1080;
                verticalSpacing = 20;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbarHeight = 228;
                dpr = 2;
                break;
            };
        case "750":
            {
                width = 750;
                verticalSpacing = 20;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbarHeight = 128;
                dpr = 2;
                break;
            };
        case "720":
            {
                width = 720;
                verticalSpacing = 20;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbarHeight = 128;
                dpr = 2;
                break;
            };
        case "375":
            {
                width = 375;
                verticalSpacing = 10;
                horizontalSpacing = 10;
                unit = "rem";
                fontSize = 14;
                navbarHeight = 64;
                dpr = 1;
                break;
            };
        case "360":
            {
                width = 360;
                verticalSpacing = 10;
                horizontalSpacing = 10;
                unit = "rem";
                fontSize = 14;
                navbarHeight = 64;
                dpr = 1;
                break;
            };
        default:
            {
                verticalSpacing = 10;
                horizontalSpacing = 10;
                fontSize = 12;
                navbarHeight = 0;
                unit = "px";
                dpr = 1;
            };
    }
    return {
        device: {
            width
        },
        page: {
            // width: json.width,
            // height: json.height
        },
        dsl: {
            lineHeight,
            verticalSpacing,
            horizontalSpacing,
            textSpacingCoefficient,
            fontSize,
            navbarHeight,
            unit,
            dpr,
            segmentingCoefficient,
            segmentingVerticalWidth,
            operateErrorCoefficient,
        },
        output: {
            debug: true
        }
    }
}