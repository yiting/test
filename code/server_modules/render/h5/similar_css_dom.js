// 样式的计算处理
const CssDom = require('./css_dom').CssDom;

// 生成的Css记录树

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
        let parentClassName = '',
            selfClassName = ''

        if (cssNode.similarParentId) {
            let similarParent = this._similarData[cssNode.similarParentId]
            prefix = similarParent.className || 'ui';
            parentClassName = `.${prefix}-s${similarParent.similarId}`;
        }

        if (cssNode.similarId) {
            let similarNode = this._similarData[cssNode.similarId],
                prefix = similarNode.className || 'ui';
            selfClassName = `.${prefix}-s${similarNode.similarId}`;
        }

        if (parentClassName) {
            return [parentClassName, selfClassName].join(' ');
        } else {
            return selfClassName;
        }
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
                    css: {},
                    className: cssNode.tplAttr.class,
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
        Object.keys(this._similarData).forEach(key => {
            let cssDomList = this._similarData[key].list;
            let css = this._similarData[key].css;
            
            cssDomList.forEach(cssDom => {
                this._mergeSimilarCSS(css, cssDom);
            });
        });
    }

    static _setMinCss(target, source) {
        return typeof target == 'number' && typeof source == 'number' ? Math.min(target, source) : null;
    }
    static _setMainCss(target, source) {
        return (target == undefined || target == source) ? source : null;
    }

    static _mergeSimilarCSS(target, source) {
        target['textAlign'] = target.textAlign || source.textAlign;
        target['display'] = target.display || source.display;
        target['boxOrient'] = target.boxOrient || source.boxOrient;
        target['boxPack'] = target.boxPack || source.boxPack;
        target['boxAlign'] = target.boxAlign || source.boxAlign;
        target['position'] = target.position || source.position;
        target['opacity'] = target.opacity || source.opacity;
        target['whiteSpace'] = target.whiteSpace || source.whiteSpace
        target['backgroundRepeat'] = target.backgroundRepeat || source.backgroundRepeat;
        target['backgroundSize'] = target.backgroundSize || source.backgroundSize;
        target['filter'] = target.filter || source.filter;
        target['border'] = target.border || source.border;
        target['textOverflow'] = target.textOverflow || source.textOverflow;
        // min css
        target['width'] = this._setMinCss(target.width, source.width);
        target['minHeight'] = this._setMinCss(target.minHeight, source.minHeight);
        target['marginTop'] = this._setMinCss(target.marginTop, source.marginTop);
        target['marginRight'] = this._setMinCss(target.marginRight, source.marginRight);
        target['marginBottom'] = this._setMinCss(target.marginBottom, source.marginBottom);
        target['marginLeft'] = this._setMinCss(target.marginLeft, source.marginLeft);
        target['paddingTop'] = this._setMinCss(target.paddingTop, source.paddingTop);
        target['top'] = this._setMinCss(target.top, source.top);
        target['right'] = this._setMinCss(target.right, source.right);
        target['bottom'] = this._setMinCss(target.bottom, source.bottom);
        target['left'] = this._setMinCss(target.left, source.left);
        target['zIndex'] = this._setMinCss(target.zIndex, source.zIndex);
        // 如果存在无背景图，则以无图为主样式
        target['backgroundImage'] = this._setMainCss(target.backgroundImage, source.backgroundImage);
        // 如果存在无背景色，则以无色为主样式
        target['backgroundColor'] = this._setMainCss(target.backgroundColor, source.backgroundColor);
        // 如果存在多色，则以无色为主样式
        target['color'] = this._setMainCss(target.color, source.color);
        // 如果存在多字类，则以默认为主样式
        target['fontFamily'] = this._setMainCss(target.fontFamily, source.fontFamily);
        // 如果存在多字号，则以默认为主样式
        target['fontSize'] = this._setMainCss(target.fontSize, source.fontSize);
        // 如果存在多圆角，则以默认为主样式
        target['borderRadius'] = this._setMainCss(target.borderRadius, source.borderRadius);
        // 如果存在多行高，则以默认为主样式
        target['lineHeight'] = this._setMainCss(target.lineHeight, source.lineHeight);
    }
}

module.exports = similarCssDom