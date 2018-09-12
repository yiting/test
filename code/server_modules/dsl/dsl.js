let H5Render = require("./dsl_render_h5.js");
let cleanse = require("./dsl_pipe_cleanse.js");
let grid = require("./dsl_pipe_grid.js");
let sort = require("./dsl_pipe_sort.js");
let contrain = require("./dsl_pipe_contrain.js");
let model = require("./dsl_pipe_model.js");
// let symbol = require("./dsl_pipe_symbol.js");
let analyze = require("./dsl_pipe_analyze.js");

function createConfig(json) {
    let width,
        verticalSpacing,
        horizontalSpacing,
        navbar,
        unit,
        fontSize,
        dpr,
        textSpacingCoefficient = 1 / 1.4;
    switch (json.width + '') {
        case "1080":
            {
                // 基于安卓设计
                width = 1080;
                verticalSpacing = 30;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbar = 228;
                dpr = 2;
                break;
            };
        case "750":
            {
                width = 750;
                verticalSpacing = 30;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbar = 128;
                dpr = 2;
                break;
            };
        case "720":
            {
                width = 720;
                verticalSpacing = 30;
                horizontalSpacing = 20;
                unit = "rem";
                fontSize = 28;
                navbar = 128;
                dpr = 2;
                break;
            };
        case "375":
            {
                width = 375;
                verticalSpacing = 15;
                horizontalSpacing = 10;
                unit = "rem";
                fontSize = 14;
                navbar = 64;
                dpr = 1;
                break;
            };
        case "360":
            {
                width = 360;
                verticalSpacing = 15;
                horizontalSpacing = 10;
                unit = "rem";
                fontSize = 14;
                navbar = 64;
                dpr = 1;
                break;
            };
        default:
            {
                verticalSpacing = 15;
                horizontalSpacing = 10;
                fontSize = 12;
                navbar = 0;
                unit = "px";
                dpr = 1;
            };
    }
    return {
        device: {
            width
        },
        page: {
            width: json.width,
            height: json.height
        },
        dsl: {
            verticalSpacing,
            horizontalSpacing,
            textSpacingCoefficient,
            fontSize,
            navbar,
            unit,
            dpr
        }
    }
}

function Klotski(json, conf) {
    if (!this || this.constructor != Klotski) {
        return new Klotski(json, conf);
    }
    let data = json;
    let config = conf;
    this.get = function() {
        return data;
    }
    this.pipe = function(fn, option) {
        let rt = fn.call(this, data, config, option);
        if (rt && rt != this) {
            data = rt;
        }
        return this;
    }
}

function mobileHtml(designDom) {
    let Config = createConfig(designDom);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(grid) // 行列组合
        .pipe(sort) // 排序
        .pipe(model) // 模型处理
        // .pipe(repeat) // 重复结构处理
        .pipe(contrain) // 约束处理
        .get(); // 获取json
    return H5Render(json, Config);
}

function analyzeDom(designDom) {
    let res;
    let Config = createConfig(designDom);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(grid) // 行列组合
        .pipe(analyze)
        .get(); // 获取json
    return json;
}
module.exports = {
    mobileHtml,
    analyzeDom
}