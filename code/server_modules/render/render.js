// render模块
//
// render模块用于将dslTree的数据和Template结合并返回可操作的render类作为数据输出
// render的处理主要分两步
// 1, 将dslTree的数据和模板接合,
// 2, 将结合后的json数据输出, 主要是约束的解析计算

const fs = require('fs');
const Utils = require('./utils');
// const Parser = require('./render_parser.js');
const H5Builder = require('./h5/h5_builder.js');
const TemplateList = require('../template/html/templatelist');
const Template = require('../template/template');
const Constraints = require('../dsl2/dsl_constraints.js');
const TemplateData = require("../template/templateData");
const QLog = require("../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);
/**
 * 
 * @param {*} dslTree 
 */
function con(data) {
    data.children && data.children.forEach(nd => con(nd));
}


let process = function (dslTree, layoutType) {

    Loger.debug(`render.js [${arguments.callee.name}]`)
    // 默认直接使用h5模板引擎输出
    TemplateData.reset();
    let renderJSON = dslTree.getRenderData().toJSON();

    try {
        // 这里直接使用h5 builder
        Loger.debug(`render.js [Template parse]`)
        let jsonData = Template.parse(renderJSON, null, TemplateList);

        Loger.debug(`render.js [new Render]`)
        let render = new Render(jsonData, H5Builder, layoutType);
        return render;
    } catch (e) {
        Loger.error(`render.js [process] ${e}`);
    }
}
class Render {
    constructor(data, builder, layoutType) {
        if (!data) {
            return;
        }
        // con(data);

        this._similarIndex = 0;
        this._similarMap = {};
        // 键值对形式缓存节点
        this._nodeCache = {};
        this._data = data;

        Loger.debug(`render.js [setSimilar]`)
        this._setSimilar(this._data);

        Loger.debug(`render.js [setSimilarChild]`)
        this._setSimilarChild();

        Loger.debug(`render.js [new builder]`)
        this._builder = new builder(this._data, layoutType);
    }
    /**
     * 遍历节点，找到相似节点
     * @param {*} data 
     */
    _setSimilar(data) {
        try {
            this._nodeCache[data.id] = data;
            if (data.similarId) {
                const similarId = data.similarId;
                if (!this._similarMap[similarId]) {
                    this._similarMap[similarId] = [];
                }
                this._similarMap[similarId].push(data);
            }
            data.children.forEach((nd => this._setSimilar(nd)));
        } catch (e) {
            Loger.error(`render.js [${arguments.callee.name}]:${e}, params[data.id:${data.id}]`)
        }
    }
    /**
     * 设置循环节点的子节点比对
     */
    _setSimilarChild() {
        try {
            Object.keys(this._similarMap).forEach(key => {
                let children = [];
                this._similarMap[key].forEach(nd => {
                    nd.children.forEach(child => {
                        child._similarSourceNodeId = nd.id;
                    })
                    children.push(...nd.children);
                });
                this._compareSimilar(children, key);
            })
        } catch (e) {
            Loger.error(`render.js [${arguments.callee.name}]:${e}`)
        }
    }
    /**
     * 对比子节点是否相似
     * @param {Array} nodes 
     */
    _compareSimilar(nodes, similarParentId) {
        try {
            // 获取需要比对相似的节点
            let compareNodes = nodes.filter(nd => {
                // 剔除绝对定位和已经是循环类型的节点
                if (nd.constraints["LayoutSelfPosition"] != Constraints.LayoutSelfPosition.Absolute &&
                    nd.similarId == null) {
                    nd.similarParentId = similarParentId;
                    return true;
                }
            });
            if (compareNodes.length == 0) {
                return;
            }
            // 根据特征分组，同组即应为相同similarId
            let groups = Utils.gatherByLogic(compareNodes, (a, b) => {
                return _similarLogic(a, b, this._nodeCache)
            });
            groups.forEach(group => {
                // length为1,即没有相似位置的元素
                let nextCompareNodes = [];
                if (group.length > 1) {
                    const similarId = '_' + this._similarIndex++;
                    this._similarMap[similarId] = group;
                    group.forEach(nd => {
                        nd.similarId = similarId;
                        nd.similarParentId = similarParentId
                        nd.children.forEach(child => {
                            child._similarSourceNodeId = nd.id;
                        })
                        nextCompareNodes.push(...nd.children);
                    });
                    this._compareSimilar(nextCompareNodes, similarParentId);
                }
            });
        } catch (e) {
            Loger.error(`render.js [${arguments.callee.name}]:${e}, params[similarParentId:${similarParentId},nodes:${nodes.map(n=>n.id).join(',')}]`)
        }
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
        try {
            fs.writeFile(path, string, function (err) {
                if (err) {
                    Loger.info(err);
                } else {
                    Loger.info(path + '生成成功');
                }
            });
        } catch (e) {
            Loger.error(`render.js [${arguments.callee.name}]:${e}, params[path:${path},string:${string}]`)
        }
    }
}


let _similarLogic = function (a, b, _nodeCache) {
    let aS = _nodeCache[a._similarSourceNodeId],
        bS = _nodeCache[b._similarSourceNodeId],
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
    return a._similarSourceNodeId != b._similarSourceNodeId &&
        (
            (Math.abs(aX - bX) < errorCoefficient &&
                Math.abs(aY - bY) < errorCoefficient) ||
            (Math.abs(aCX - bCX) < errorCoefficient &&
                Math.abs(aCY - bCY) < errorCoefficient
            )
        )
}

module.exports = {
    process
}