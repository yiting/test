// import config
const config = require("./dsl_config.js");
// import pipe
const cleanse = require("./dsl_pipe_cleanse.js");
const layout = require("./dsl_pipe_layout.js");
const sort = require("./dsl_pipe_sort.js");
const contrain = require("./dsl_pipe_contrain.js");
const model = require("./dsl_pipe_model.js");
const absLayout = require("./dsl_pipe_absLayout.js");
const analyze = require("./dsl_pipe_analyze.js");
const restructure = require("./dsl_pipe_restructure.js");

// import render
const H5Render = require("./dsl_render_h5.js");

function Klotski(json, conf) {
    if (!this || this.constructor != Klotski) {
        return new Klotski(json, conf);
    }
    let data = json;
    let config = conf;
    this.get = function () {
        return data;
    }
    this.pipe = function (fn, option) {
        let rt = fn.call(this, data, config, option);
        if (rt && rt != this) {
            data = rt;
        }
        return this;
    }
}

function mobileHtml(designDom) {
    let Config = config.create(750);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        .pipe(sort) // 排序
        // .pipe(analyze) // 结构分析
        .pipe(model) // 模型处理
        .pipe(contrain) // 约束处理
        // .pipe(restructure)
        // .pipe(absLayout)
        .get(); // 获取json
    return H5Render(json, Config);
}

//2018-10-24
/**
 * 获取页面json
 * @param designDom
 */
function getHtmlJson(designDom) {
    let Config = config.create(750);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        // .pipe(sort) // 排序
        // .pipe(analyze) // 结构分析
        // .pipe(model) // 模型处理
        // .pipe(contrain) // 约束处理
        //.pipe(absLayout)
        .get(); // 获取json
    return json;
}

function analyzeDom(designDom) {
    let res = {};
    let Config = config.create(750);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        .pipe(analyze, {
            matchGroup: function (r) {
                res.matchGroupResult = r
            },
            matchModel: function (r) {
                res.matchModelResult = r;
            }
        })
        .get(); // 获取json
    return res;
}
module.exports = {
    mobileHtml,
    getHtmlJson,
    analyzeDom
}