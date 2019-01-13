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
const Constraints = require('../dsl2/dsl_constraints.js');
/**
 * 
 * @param {*} dslTree 
 */
let process = function (dslTree) {
    // 默认直接使用h5模板引擎输出
    let jsonData = Parser.parse(dslTree.getRenderData().toJSON());
    // 这里直接使用h5 builder
    let render = new Render(jsonData, H5Builder, Common.FlexLayout);

    return render;
}


class Render {
    constructor(data, builder, layoutType) {
        if (!data) {
            return;
        }
        this._similarIndex = 0;
        this._similarMap = {};
        // 键值对形式缓存节点
        this._nodeCache = {};
        this._data = data;
        this._setSimilar(this._data);
        this._setSimilarChild();
        this._builder = new builder(this._data, layoutType);
    }
    /**
     * 遍历节点，找到相似节点
     * @param {*} data 
     */
    _setSimilar(data) {
        this._nodeCache[data.id] = data;
        if (data.similarId) {
            const similarId = data.similarId;
            if (!this._similarMap[similarId]) {
                this._similarMap[similarId] = [];
            }
            this._similarMap[similarId].push(data);
        }
        data.children.forEach((nd => this._setSimilar(nd)));
    }
    /**
     * 设置循环节点的子节点比对
     */
    _setSimilarChild() {
        Object.keys(this._similarMap).forEach(key => {
            let children = [];
            this._similarMap[key].forEach(nd => {
                nd.children.forEach(child => {
                    child.similarParentId = nd.id;
                })
                children.push(...nd.children);
            });
            this._compareSimilar(children);
        })
    }
    /**
     * 对比子节点是否相似
     * @param {Array} nodes 
     */
    _compareSimilar(nodes) {
        // 获取需要比对相似的节点
        let compareNodes = nodes.filter(nd => {
            // 剔除绝对定位和已经是循环类型的节点
            return nd.constraints["LayoutSelfPosition"] != Constraints.LayoutSelfPosition.Absolute &&
                nd.similarId == null;
        });
        if (compareNodes.length == 0) {
            return;
        }
        // 根据特征分组，同组即应为相同similarId
        let groups = Utils.gatherByLogic(compareNodes, (a, b) => {
            let aS = this._nodeCache[a.similarParentId],
                bS = this._nodeCache[b.similarParentId],
                aX = a.abX - aS.abX,
                aY = a.abY - aS.abY,
                bX = b.abX - bS.abX,
                bY = b.abY - bS.abY,
                aXops = aS.abXops - a.abXops,
                aYops = aS.abYops - a.abYops,
                bXops = bS.abXops - b.abXops,
                bYops = bS.abYops - b.abYops,
                aCX = (aX + aXops) / 2,
                aCY = (aY + aYops) / 2,
                bCX = (bX + bXops) / 2,
                bCY = (bY + bYops) / 2;
            const errorCoefficient = 3;
            // 不同源，且位置相同的节点
            return a.similarParentId != b.similarParentId &&
                (
                    (Math.abs(aX - bX) < errorCoefficient &&
                        Math.abs(aY - bY) < errorCoefficient) ||
                    (Math.abs(aCX - bCX) < errorCoefficient &&
                        Math.abs(aCY - bCY) < errorCoefficient
                    )
                )
        });
        groups.forEach(group => {
            // length为1,即没有相似位置的元素
            let nextCompareNodes = [];
            if (group.length > 1) {
                const similarId = 'c-' + this._similarIndex++;
                this._similarMap[similarId] = group;
                group.forEach(nd => {
                    nd.similarId = similarId;
                    nd.children.forEach(child => {
                        child.similarParentId = nd.similarParentId;
                    })
                    nextCompareNodes.push(...nd.children);
                });
                _compareSimilar(nextCompareNodes);
            }
        });
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