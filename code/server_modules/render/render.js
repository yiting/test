// render模块
//
// render模块用于将dslTree的数据和Template结合并返回可操作的render类作为数据输出
// render的处理主要分两步
// 1, 将dslTree的数据和模板接合,
// 2, 将结合后的json数据输出, 主要是约束的解析计算

const Utils = require('./render_utils');
const Common = require('../dsl2/dsl_common.js');
const Parser = require('./render_parser.js');
const H5Builder = require('./h5/h5_builder.js');
const fs = require('fs');
/**
 * 
 * @param {*} dslTree 
 */
let process = function (dslTree) {
    // 默认直接使用h5模板引擎输出
    let jsonData = Parser.parse(dslTree);
    // 这里直接使用h5 builder
    let render = new Render(jsonData, H5Builder, Common.FlexLayout);

    return render;
}


class Render {
    constructor(data, builder, layoutType) {
        if (!data) {
            return;
        }
        this._similarMap = {};
        this._nodeMap = {};
        this._data = data;
        setSimilar(this.data);
        setSimilarChild();
        this._builder = new builder(this._data, layoutType);
    }
    setSimilar(data) {
        if (data.similarId) {
            similarId = data.similarId;
            if (!this._similarMap[similarId]) {
                this._similarMap[similarId] = [];
            }
            this._similarMap[similarId].push(data);
        }
        data.children.forEach(setSimilar);
    }

    setSimilarChild() {
        Object.keys(this._similarMap).forEach(key => {
            let children = this._similarMap[key];
            children.forEach(child=>{

            })
        })
    }

    compareSimilar(doms){
        Utils.gatherByLogic(doms,(a,b)=>{
            a.parentId!=b.parentId&&
            a.abX-
        })
    }

    getTpl() {
        return this._builder._getTpl();
    }

    /**
     * 返回结构字符串
     * @return {String}
     */
    getTagString(cssName) {
        let htmlStr = '';
        if (this._builder) {
            htmlStr = this._builder.getTagString();
        }
        //添加完整的html结构
        var tpl = this.getTpl();
        var result = tpl.replace('${htmlStr}', htmlStr).replace('${cssName}', cssName);
        return result;
    }

    /**
     * 返回样式字符串
     * @returns {String}
     */
    getStyleString() {
        let cssStr = '';
        if (this._builder) {
            cssStr = this._builder.getStyleString();
        }
        return cssStr;
    }



    /**
     * 根据路径输出字符串
     * @param {String} path
     * @param {String} string
     */
    outputFileWithPath(path, string) {
        fs.writeFile(path, string, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(path + '生成成功');
            }
        });
    }
}


module.exports = {
    process
}