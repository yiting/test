// 样式的计算处理
const CssDom = require('./css_dom').CssDom;

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
        "zIndex"
    ],
    minCss = [
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
    ]


class similarCssDom {

    static process(cssDomTree, layoutType) {
        this._cssDomTree = cssDomTree
        this._similarData = {}
        // 遍历节点，构建similar元素
        this._buildSimilarData(this._cssDomTree);
        this._buildSimilarCss(this._similarData);
        return this._similarData;
    }
    static getCssString() {
        let css = [];
        Object.keys(this._similarData).forEach(key => {
            let cssNode = this._similarData[key];
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
    static _buildSimilarData(cssNode) {
        // 如果存在相似节点，则存储相似节点到simialrData
        let similarId = cssNode.similarId;
        if (similarId) {
            if (!this._similarData[similarId]) {
                this._similarData[similarId] = {
                    modelId: cssNode.modelId,
                    similarId: similarId,
                    similarParentId: cssNode.similarParentId,
                    similarCssName: cssNode.similarCssName,
                    css: {},
                    list: []
                };
            }
            this._similarData[similarId].list.push(cssNode);
            if (this._similarData[similarId].className && this._similarData[similarId].className == cssNode.tplAttr.class) {
                this._similarData[similarId].className = null;
            }
        }
        cssNode.children.forEach(nd => this._buildSimilarData(nd));
    }

    static _buildSimilarCss() {
        Object.keys(this._similarData).forEach(sid => {
            let cssDomList = this._similarData[sid].list;

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
                this._similarData[sid].css[key] = this._setMainCss(cssObj[key]);
            })
            minCss.forEach(key => {
                this._similarData[sid].css[key] = this._setMinCss(cssObj[key]);
            });
        });
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
                maxValue = value.v;
            }
        })
        return maxValue;
    }

    static _mergeSimilarCSS(target, source) {}
}

module.exports = similarCssDom