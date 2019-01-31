// 样式的计算处理
const CssDom = require('./css_dom').CssDom;

const QLog = require("../../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);

// 生成的Css记录树

let mainCss = [
        "textAlign",
        "display",
        "boxOrient",
        "boxPack",
        "boxAlign",
        "position",
        "opacity",
        "whiteSpace",
        "backgroundRepeat",
        "backgroundSize",
        "filter",
        "border",
        "textOverflow",
        "backgroundImage",
        "backgroundColor",
        "color",
        "fontFamily",
        "fontSize",
        "borderRadius",
        "lineHeight",
        "zIndex",
        "width",
        "minHeight",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "paddingTop",
        "top",
        "right",
        "bottom",
        "left",
    ],
    minCss = []


class similarCssDom {

    static process(cssDomTree, layoutType) {
        Loger.debug(`similar_css_dom.js [process],enter[cssDomTree:${cssDomTree&&cssDomTree.id}]`);

        this._cssDomTree = cssDomTree
        this._similarMap = {}
        // 遍历节点，构建similar元素
        Loger.debug(`similar_css_dom.js [_buildSimilarData]`);
        this._buildSimilarData(this._cssDomTree);

        Loger.debug(`similar_css_dom.js [_buildSimilarCss]`);
        this._buildSimilarCss(this._similarMap);
        return this._similarMap;
    }
    static getCssString() {
        Loger.debug(`similar_css_dom.js [getCssString],enter[_similarMap:${this._similarMap&&Object.keys(this._similarMap)}]`);

        let css = [];
        Object.keys(this._similarMap).forEach(key => {
            let cssNode = this._similarMap[key];
            let className = this._getClass(cssNode);
            let cssStr = this._getCssProperty(cssNode.css);
            css.push(`${className}{${cssStr}}`);
        });
        return css.join('\n');
    }
    /**
     * 重复样式命名规则，待写
     */
    static _getClass(cssNode) {
        return cssNode.similarCssName.map(n => '.' + n).join(' ')
    }
    /* static _getClass(cssNode) {
        let parentClassName = '',
            selfClassName = ''

        if (cssNode.similarParentId) {
            parentClassName = '.sim' + cssNode.similarParentId;
        }

        if (cssNode.similarId) {
            selfClassName = '.sim' + cssNode.similarId;
        }

        if (parentClassName) {
            return [parentClassName, selfClassName].join(' ');
        } else {
            return selfClassName;
        }
    } */
    /**
     * 输出样式属性
     * @param {Node} cssNode 
     */
    static _getCssProperty(cssNode) {
        let props = [];
        Object.keys(cssNode).forEach(key => {
            let value = cssNode[key];
            if (value !== null && value !== undefined) {
                props.push(CssDom.getCssProperty(key, value));
            }
        });
        return props.join(';');
    }
    /**
     * 构建相似节点数据集
     * @param {*} cssNode 
     */
    static _buildSimilarData(cssNode) {
        try {
            // 如果存在相似节点，则存储相似节点到simialrData
            let similarId = cssNode.similarId;
            if (similarId) {
                if (!this._similarMap[similarId]) {
                    this._similarMap[similarId] = {
                        modelId: cssNode.modelId,
                        similarId: similarId,
                        similarParentId: cssNode.similarParentId,
                        similarCssName: cssNode.similarCssName,
                        css: {},
                        list: []
                    };
                }
                this._similarMap[similarId].list.push(cssNode);
                if (this._similarMap[similarId].className && this._similarMap[similarId].className == cssNode.tplAttr.class) {
                    this._similarMap[similarId].className = null;
                }
            }
            cssNode.children.forEach(nd => this._buildSimilarData(nd));
        } catch (e) {
            Loger.error(`similar_css_dom.js [_buildSimilarData] ${e},params[cssNode.id:${cssNode.id},cssNode.similarId:${cssNode.similarId}]`);
        }
    }

    static _buildSimilarCss() {
        try {
            Object.keys(this._similarMap).forEach(sid => {
                let cssDomList = this._similarMap[sid].list;

                let cssObj = {};
                cssDomList.forEach(cssDom => {
                    mainCss.forEach(key => {
                        if (cssObj[key] == undefined) {
                            cssObj[key] = []
                        }
                        cssObj[key].push(cssDom[key])
                    })
                    minCss.forEach(key => {
                        if (cssObj[key] == undefined) {
                            cssObj[key] = []
                        }
                        cssObj[key].push(cssDom[key])
                    })
                });
                mainCss.forEach(key => {
                    this._similarMap[sid].css[key] = this._setMainCss(cssObj[key]);
                });
                minCss.forEach(key => {
                    this._similarMap[sid].css[key] = this._setMinCss(cssObj[key]);
                });
            });
        } catch (e) {
            Loger.error(`similar_css_dom.js [_buildSimilarCss] ${e}`);
        }
    }

    static _setMinCss(cssArr) {
        let s = cssArr.filter(value => {
            return typeof value == 'number'
        });
        return Math.min(...s);

    }
    static _setMainCss(cssArr) {
        // return (target == undefined || target == source) ? source : null;
        let o = {};
        cssArr.forEach(value => {
            if (!o[value]) {
                o[value] = {
                    v: value,
                    c: 0
                };
            }
            o[value].c++
        });
        let max = 0,
            maxValue;
        Object.keys(o).forEach(value => {
            if (o[value].c > max) {
                max = o[value].c
                maxValue = o[value].v;
            }
        })
        return maxValue;
    }

    static _mergeSimilarCSS(target, source) {}
}

module.exports = similarCssDom