// import config
const Config = require("./dsl_config.js");
// import pipe
const cleanse = require("./dsl_pipe_cleanse.js");
const layout = require("./dsl_pipe_layout.js");
const sort = require("./dsl_pipe_sort.js");
const contrain = require("./dsl_pipe_contrain.js");
const model = require("./dsl_pipe_model.js");
const absLayout = require("./dsl_pipe_absLayout.js");
const analyze = require("./dsl_pipe_analyze.js");
const cyclicAnalyze = require("./dsl_pipe_cyclicAnalyze.js");
// import render
const H5Render = require("./dsl_render_h5.js");
// import base
const Dom = require("./dsl_dom.js");
// common
const Common = require("./dsl_common.js");


function Klotski(json) {
    if (!this || this.constructor != Klotski) {
        return new Klotski(json);
    }
    let data = json;
    this.attachment = {};
    this.get = function () {
        return data;
    }
    this.attach = function (key, value) {
        this.attachment[key] = value;
        return this;
    }
    this.pipe = function (fn) {
        let rt = fn.call(this, data);
        if (rt && rt != this) {
            data = rt;
        }
        return this;
    }
}
/**
 * 插入AI数据
 * @param {Array} designDom 设计数据
 * @param {Array} aiData AI数据
 */
function insertAI(designDom, aiData) {
    let config = Object.assign({}, config.create(750));
    let aiGroup = []
    aiData.forEach(a => {
        if (a.rate < .85) {
            return;
        }
        a.abX = a.x;
        a.abY = a.y;
        designDom.forEach(dom => Dom.cleanLineHeight(dom, config.dsl.lineHeight));
        const doms = designDom.filter(dom => {
            return Dom.wrap(a, dom);
        });
        if (doms.length > 1) {
            aiGroup.push(
                doms.map(s => s.id)
            );
        }
    });
    return insertJson(designDom, ...aiGroup);;

}

function insertJson(designDom, ...idss) {
    let config = Object.assign({}, Config.create(750));
    let jsons = [];
    idss.forEach(ids => {
        if (ids.length < 2) {
            return
        }
        let doms = designDom.filter(dom => {
            return ids.includes(dom.id);
        });
        doms.forEach(dom => Dom.cleanLineHeight(dom, config.dsl.lineHeight));
        let {
            x,
            y,
            abX,
            abY,
            width,
            height
        } = Dom.calRange(doms);
        const res = {
            id:Common.guid(),
            source: "insert",
            x,
            y,
            abX,
            abY,
            width,
            height,
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
    let config = Object.assign({}, Config.create(750), conf);
    var json = Klotski(designDom)
        .attach("config", config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        .pipe(sort) // 排序
        .pipe(model) // 模型处理
        .pipe(cyclicAnalyze) // 重复模型分析
        .pipe(contrain) // 约束处理
        .get(); // 获取json
    return H5Render(json, config);
}
/**
 * ct输出展示
 * @param {Array} designDom 设计数据
 * @param {Object} conf 配置项
 */
function absoluteHtml(designDom, conf) {
    let config = Object.assign({}, Config.create(750), conf);
    var json = Klotski(designDom)
        .attach("config", config)
        .pipe(cleanse) // 清洗
        .pipe(absLayout)
        .get()

    return H5Render(json, config)
}

function analyzeDom(designDom, conf) {
    let res = {};
    let config = Object.assign({}, Config.create(750), conf);
    var json = Klotski(designDom, config)
        .attach("config", config)
        .pipe(cleanse) // 清洗
        .pipe(layout) // 行列组合
        .pipe(analyze
            /* , {
                        matchGroup: function (r) {
                            res.matchGroupResult = r
                        },
                        matchModel: function (r) {
                            res.matchModelResult = r;
                        }
                    } */
        )
        .get(); // 获取json
    // return res;
}
module.exports = {
    insertJson,
    insertAI,
    mobileHtml,
    analyzeDom,
    absoluteHtml
}