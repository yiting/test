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
const repeatAnalyze = require("./dsl_pipe_repeatAnalyze.js");
// import render
const H5Render = require("./dsl_render_h5.js");
// import base
const Dom = require("./dsl_dom.js");

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

function insertJson(designDom, ...idss) {
    let Config = Object.assign({}, config.create(750));
    let jsons = [];
    idss.forEach(ids => {
        if (ids.length < 2) {
            return
        }
        let doms = designDom.filter(dom => {
            return ids.includes(dom.id);
        });
        doms = JSON.parse(JSON.stringify(doms));
        doms.forEach(dom => Dom.cleanLineHeight(dom, Config.dsl.lineHeight));
        let {
            x,
            y,
            abX,
            abY,
            width,
            height
        } = Dom.calRange(doms);
        const res = {
            id: ids.join('|'),
            x,
            y,
            abX,
            abY,
            width,
            height,
            special: true,
        };
        jsons.push(res);
    })
    return designDom.concat(jsons);
}
/**
 * 输出HTML
 * @param {Array} designDom 设计数据
 * @param {Object} conf 配置项
 */
function mobileHtml(designDom, conf) {
    let Config = Object.assign({}, config.create(750), conf);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        .pipe(sort) // 排序
        // .pipe(analyze) // 结构分析
        .pipe(model) // 模型处理
        .pipe(repeatAnalyze) // 重复模型分析
        .pipe(contrain) // 约束处理
        // .pipe(absLayout)
        .get(); // 获取json
    return H5Render(json, Config);
}
/**
 * ct输出展示
 * @param {Array} designDom 设计数据
 * @param {Object} conf 配置项
 */
function ctHtml(designDom, conf) {
    let Config = Object.assign({}, config.create(750), conf);
    var json = Klotski(designDom, Config)
        .pipe(cleanse) // 清洗
        .pipe(absLayout)
        .get()

    return H5Render(json, Config)

}

function analyzeDom(designDom, conf) {
    let res = {};
    let Config = Object.assign({}, config.create(750), conf);
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
    insertJson,
    mobileHtml,
    analyzeDom,
    ctHtml
}