// 样式的计算处理
const Common = require('../../dsl2/dsl_common.js');
const Constraints = require('../../dsl2/dsl_constraints.js');
const Utils = require('../render_utils.js');

// 生成的Css记录树
let cssDomTree = null;

// 
let process = function(data, layoutType) {
    // 构建cssTree并返回
    cssDomTree = new CssDom(null, data, layoutType);
    _buildTree(cssDomTree, data.children, layoutType);
}

let getCssString = function() {
    // 获取cssTree解析出的样式
    let cssStr = '';
    let css = [];           // 每个CssDom节点返回的样式数组
    _parseTree(css, cssDomTree);
    //将 [ts-layer0] {width: 7.5rem;height: 0rem; } 形式改为css形式
    css.forEach(function(value,key,arr){
        cssStr += value + '\n';
    });
    return cssStr;
}

/**
 * 构建cssDom树
 * @param {Object} parent 
 * @param {Json} data 
 * @param {Int} layoutType 
 */
let _buildTree = function(parent, datas, layoutType) {
    datas.forEach(data => {
        let cssNode = new CssDom(parent, data, layoutType);
        parent.children.push(cssNode);

        if (data.children && data.children.length > 0) {
            _buildTree(cssNode, data.children, layoutType);
        }
    });
}

/**
 * 解析获取css属性
 * @param {Array} arr 字符串收集数组
 * @param {CssDom} dom CssDom节点
 */
let _parseTree = function(arr, dom) {
    let str = dom.getCss();
    arr.push(str);

    dom.children.forEach(child => {
        _parseTree(arr, child);
    });
}

/**
 * 单位换算
 * @param  {Number} number 数值
 * @param  {String} unit   单位类型，默认px
 * @return {String}        数值+单位
 */
let _transUnit = function(number, unit = "rem") {
    number = parseInt(number) || 0;
    const dpr = 2;
    // 1-2像素特殊处理
    if (Math.abs(number) <= dpr) {
        number = Math.ceil(number / dpr);
        unit = 'px';
    }
    if (unit == 'rem') {
        return number / 100 + 'rem';
    } else {
        return number + 'px';
    }
}
 
const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align'];
const CompatibleValue = ['box'];

const cssPropertyMap = [
    // 布局类
    'display',
    'boxOrient',
    'boxPack',
    'boxAlign',
    'width',
    // 'height',
    'minHeight',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'top',
    'right',
    'bottom',
    'left',
    // 'zIndex'

    // // 属性类

    // "marginLeft",
    // "marginTop",
    // "marginRight",
    // "marginBottom",
    // "left",
    // "right",
    // "top",
    // "bottom",
    // "zIndex"
    "backgroundImage",
    "backgroundColor",
    "backgroundSize",
    // "backgroundRepeat",
    // "padding",
    "color",
    // "fontFamily",
    "fontSize",
    "position",
    // "border",
    // "boxSizing",
    "borderRadius",
    // "overflow",
    // "textOverflow",
    // "boxFlex",
    // "boxOrient",
    // "boxPack",
    // "boxAlign",
    // "display",
    // "textAlign",
    // "whiteSpace",
    "lineHeight",
    "opacity"
];

class CssDom {
    constructor(parent, data, layoutType) {
        // 节点的信息
        this.id = data.id; 
        this.type = data.type;
        this.modelName = data.modelName;
        this.canLeftFlex = data.canLeftFlex;
        this.canRightFlex = data.canRightFlex;
        this.isCalculate = data.isCalculate;
        this.tplAttr = data.tplAttr;
        this.tplData = data.tplData;

        this.parent = parent? parent : this;
        this.layoutType = layoutType;
        
        // 布局计算的数值
        this._abX = data.abX;
        this._abY = data.abY;
        this._abXops = data.abXops;
        this._abYops = data.abYops;
        this._width = data.width;
        this._height = data.height;

        // 样式属性
        this.constraints = data.constraints;
        this.path = data.path;
        this.styles = data.styles || {};
        // 子节点
        this.children = [];
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _prevNode() {
        if (this.type == Common.QBody) {    // 根节点
            return this;  
        }

        let len = this.parent.children.length;
        // 只有自己
        if (len <= 1) {
            return null;
        }
        
        let canBegin = false;
        for (let i = len - 1; i >= 0; i--) {
            let node = this.parent.children[i];

            if (node.id == this.id) {
                // 此时只剩下自己
                if (i <= 0) {
                    return null;
                }
                canBegin = true;
                continue;
            }

            if (canBegin) {     // 这里开始就是开始寻找"上一个节点了"
                if (this._isAbsolute(node)) {
                    continue;
                }

                return node;
            }
        }
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _prevNodeWithParam(nodes,curIndex) {
        var index = curIndex -1;
        while(index >= 0){
            if(!this._isAbsolute(nodes[index])){
                return nodes[index];
            }
            index --;
        }
        return null;
    }

    /**
     * 获取当前节点的前一个兄弟节点,若没有则返回null
     */
    _nextNodeWithParam(nodes,curIndex) {
        var index = curIndex +1;
        while(index < nodes.length){
            if(!this._isAbsolute(nodes[index])){
                return nodes[index];
            }
            index ++;
        }
        return null;
    }

    /**
     * 获取当前节点的下一个兄弟节点,若没有则返回null
     */
    _nextNode() {
        if (this.type == Common.QBody) {    // 根节点
            return this;  
        }

        let len = this.parent.children.length;
        // 只有自己
        if (len <= 1) {
            return null;
        }
        
        let canBegin = false;
        for (let i = 0; i < len; i++) {
            let node = this.parent.children[i];

            if (node.id == this.id) {
                // 此时只剩下自己
                if (i >= len) {
                    return null;
                }
                canBegin = true;
                continue;
            }

            if (canBegin) {     // 这里开始就是开始寻找"下一个节点了"
                if (this._isAbsolute(node)) {
                    continue;
                }

                return node;
            }
        }
    }

    /**
     * 节点是否属于绝对定位
     * @param {CssDom} node 
     */
    _isAbsolute(node) {
        if (node.constraints['LayoutSelfPosition']
            && node.constraints['LayoutSelfPosition'] == Constraints.LayoutSelfPosition.Absolute) {
            return true;
        }

        if (node.parent.constraints['LayoutPosition']
            && node.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute) {
            return true;        
        }

        return false;
    }

    /**
     * 节点的排列是否为横排
     * @returns {Boolean}
     */
    _isParentHorizontal() {
        let res = false;        // 默认为竖排
        let parent = this.parent;
        if (parent.children.length == 1) {  // 1个元素默认是竖排
            return res;
        }

        if (parent.constraints['LayoutDirection']
            && parent.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {
            res = true;
        }

        return res;
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _isFixedWidth(node) {
        let result = false;

        if (!node.modelName) {
            // 不是模板元素, 默认做最大扩展
            return false;
        }

        if (node.constraints['LayoutFixedWidth'] 
            && node.constraints['LayoutFixedWidth'] == Constraints.LayoutFixedWidth.Fixed) {
            
            result = true;
        }
        else if (node.modelName && (node.canLeftFlex || node.canRightFlex)) {
            // 有node.modelName 则为不是模板生成的元素
            result = true;
        }
        return result;
    }

    /**
     * 节点是否为固定宽度节点
     * @param {CssDom} node CssDom节点
     */
    _isFixedHeight(node) {
        let result = false;

        if (!node.modelName) {
            // 不是模板元素, 默认做最大扩展
            return false;
        }

        if (node.constraints['LayoutFixedHeight']
            && node.constraints['LayoutFixedHeight'] == Constraints.LayoutFixedHeight.Fixed) {
            
            result = true;
        }
        else if (node.modelName) {
            // 有node.modelName 则为非模板生成的元素,可以认为是固定高
            result = true;
        }
        return result;
    }

    /**
     * !重要,_calculateConstraints主要是对模板里的元素(ref, 非ref进行约束计算)
     * 计算出模板里面各元素的位置, abX, abY, abXops, abYops
     */
    _calculateConstraints(node) {
        if (node.children.length == 0) {
            return;
        }

        // 固定布局的约束
        if (node.constraints['LayoutPosition']
            && node.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute) {
            
            node.children.forEach(nd => {
                nd.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute;
            });

            return;
        }
        if(this._isAbsolute(node)){
            return ;
        }

        if (node.constraints['LayoutDirection']
            && node.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {

            this._calculateHorizontal(node, node.children);
        }
        else {
            this._calculateVertical(node, node.children);
        }
    }

    /**
     * 计算模板横向的约束
     * @param {Node} parent 父节点
     * @param {Array} nodes 子节点
     */
    _calculateHorizontal(parent, nodes) {
        // 计算前节点的右边, 和当前节点的左边, for后等于计算了所有节点的左右边界
        let len = nodes.length;
        for (let i = 0; i < len; i++) {
            let preNode = this._prevNodeWithParam(nodes,i);
            let curNode = nodes[i];
            let nxtNode = this._nextNodeWithParam(nodes,i);

            if (curNode.isCalculate) {
                // 有模型名称的为模板外面节点,已经在dsl_layout处计算完毕
                continue;
            }

            if (this._isAbsolute(curNode)) {
                // 绝对定位的节点不进行处理
                continue;
            }
            
            // 处理abX, abXops计算
            if (!preNode) {     // 只需处理curNode
                if (curNode.canLeftFlex && !this._isFixedWidth(curNode)) {
                    curNode._abX = parent._abX;
                }
            }
            else {  // 处理preNode和curNode的情况 2*2=4种情况
                if(!this._isAbsolute(preNode) && !this._isAbsolute(curNode)){
                    if ((preNode.canRightFlex || !preNode.modelName) && (!curNode.canLeftFlex && curNode.modelName)) {  // 左节点可以扩展右节点不能扩展
                        preNode._abXops = curNode._abX;
                        //curNode._abX = curNode._abX;
                    }
                    else if ((!preNode.canRightFlex && preNode.modelName) && (curNode.canLeftFlex || !curNode.modelName)) {    // 左节点不能扩展右节点可以扩展
                        //preNode._abXops = preNode._abXops;
                        curNode._abX = preNode._abXops;
                    }
                    else if ((preNode.canRightFlex || !preNode.modelName) && (curNode.canLeftFlex || !curNode.modelName)) {
                        // 各占一半空间
                        let half = (curNode._abX - preNode._abXops) / 2;
                        preNode._abXops += half;
                        curNode._abX -= half;
                    }
                    else {
                        // !preNode.canRightFlex && !curNode.canLeftFlex
                        // 不用处理了, 保持不变
                    }
                }
                

                // 如果没有下一个节点了, 就把curNode的右边界也处理了
                if (!nxtNode) {
                    if (curNode.canRightFlex && !this._isFixedWidth(curNode)) {
                        curNode._abXops = parent._abXops;
                    }
                }
            }

            // 处理abY, abYops计算
            if (!curNode.modelName) {   // 模板动态元素
                curNode._abY = parent._abY;
                curNode._abYops = parent._abYops;
            }
        }
    }

    /**
     * 计算模板竖向的约束
     * @param {Node} parent 父节点
     * @param {Array} nodes 子节点
     */
    _calculateVertical(parent, nodes) {
        // 竖向的计算只需计算模板动态新增元素的上下距离
        // node.modelName为空即node为模板动态元素
        let len = nodes.length;
        
        if (len == 1) {
            // 处理上下距离
            let curNode = nodes[0];
            if (!curNode.modelName) {  // 模板非模型元素节点
                curNode._abY = parent._abY;
                curNode._abYops = parent._abYops;
            }
            
            // 处理左右距离
            if (curNode.canLeftFlex) {
                curNode._abX = parent._abX;
            }
            else if (curNode.canRightFlex) {
                curNode._abXops = parent._abXops;
            }

            return;
        }

        for (let i = 0; i < len; i++) {
            let preNode = nodes[i - 1];
            let curNode = nodes[i];
            let nxtNode = nodes[i + 1];

            if (curNode.isCalculate) {
                // 有模型名称的为模板外面节点,已经在dsl_layout处计算完毕
                continue;
            }

            if (!preNode) {
                if (!this._isFixedHeight(curNode)) {
                    curNode._abY = parent._abY;
                }
            }
            else {  // 处理preNode和curNode的情况4种情况
                if (!preNode.modelName && curNode.modelName) {
                    preNode._abYops = curNode._abY;
                    //curNode._abY = curNode._abY;
                }
                else if (preNode.modelName && !curNode.modelName) {
                    //preNode._abYops = preNode._abYops;
                    curNode._abY = preNode._abYops;
                }
                else if (!preNode.modelName && !curNode.modelName) {
                    // 各占一半
                    let half = (curNode._abY - preNode._abYops) / 2;
                    preNode._abYops += half;
                    curNode._abY -= half;
                }
                else {
                    // preNode.modelName && curNode.modelName
                    // 不用处理, 都是模型元素
                }

                // 如果没有下一个节点了, 就把curNode的下边界也处理了
                if (!nxtNode) {
                    // 由于是竖排,不需往下扩展
                    curNode._abYops = curNode._abYops;
                }
            }

            // 处理左右距离
            if (curNode.canLeftFlex) {
                curNode._abX = parent._abX;
            }
            else if (curNode.canRightFlex) {
                curNode._abXops = parent._abXops;
            }
        }
    }

    /**
     * 获取className
     */
    getClass() {
        return this._class ? `.${this._class} \#${this.id}` : `\#${this.id}`;
    }

    /**
     * 获取得到的属性
     */
    getCssProperty() {
        let props = [];
        // 获取属性值并进行拼接
        // console.log(this.id);
        cssPropertyMap.forEach(key => {
            let value = this[key];
            
            if (value !== null) {
                if (!isNaN(value) && key != "opacity") {    // 数字的话进行单位转换
                    value = _transUnit(value);
                }

                let name = Utils.nameLower(key);
                if (CompatibleKey.includes(name)) {
                    const webkitName = '-webkit-' + name;
                    props.push(`${webkitName}: ${value}`);
                } 
                else {
                    props.push(`${name}: ${value}`);
                }
            }
        });
        // console.log(props);
        // console.log('--------------------------');
        return props.join(';');
    }

    /**
     * 获取该节点的样式
     */
    getCss() {
        let str = '';
        str = `${this.getClass()} {${this.getCssProperty()}}`;
        // !重要, 每次获取当前节点样式信息后
        // 动态计算该节点的子节点的根据约束而生成_abX, _abY, _abXops, _abYops等数据
        this._calculateConstraints(this);

        return str;
    }

    // 转换过的基于父节点的parentX
    get parentX() {
        return (this._abX - this.parent._abX);
    }

    // 转换过的基于父节点的parentY
    get parentY() {
        return (this._abY - this.parent._abY);
    }
    //
    get display() {
        let css = null;
        // -webkit-flex, block, inline-block, inline
        // 竖排默认不返回
        if (this.constraints['LayoutDirection']
            && this.constraints['LayoutDirection'] == Constraints.LayoutDirection.Horizontal) {
            css = '-webkit-box';
        }
        return css;
    }
    //
    get boxOrient() {
        let css = null;
        // start, flex-end, center, space-between, space-around
        if (this.display) {
            // 排列顺序, 先hardcode横排
            css = 'horizontal';
        }
        return css;
    }
    //
    get boxAlign() {
        let css = null;
        if (this.boxOrient) {   
            // 横排情况, 先左到右
            css = 'start';
        }
        return css;
    }
    //
    get boxPack() {
        return null;
    }
    //
    get width() {
        return Math.abs(this._abXops - this._abX);
    }
    /**
     * 
     * @param {Array} vals 圆角数组
     * @param {Number} maxSize 圆角最大值
     */
    getRadius(vals, maxSize = 100) {
        var that = this;
        if (!(vals instanceof Array)) {
            vals = [vals];
        }
        return vals.map(v => {
            v = v < maxSize / 2 ? v : maxSize / 2;
            return that.transUnit(v);
        }).join(' ');
    }
    get borderRadius() {
        if (this.styles.borderRadius) {
            return this.getRadius(this.styles.borderRadius, Math.min(this.height, this.width));
        }else{
            return null;
        }
    }
    //
    get height() {
        return Math.abs(this._abYops - this._abY);
    }
    get minHeight() {
        return Math.abs(this._abYops - this._abY);
    }

    get backgroundColor() {
        if (this.styles && this.styles.background &&
            this.styles.background.type == 'color') {
            return this.getRGBA(this.styles.background.color); CSSRender.getRGBA(this.styles.background.color);
        }else{
            return null;
        }
    }

    //
    get top() {
        let css = null;
        if (false) {
            // 这里是预留给fixed定位约束
            css = this._abY;
        }
        else if ((this.parent.constraints['LayoutPosition']
                    && this.parent.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute) 
                        || (this.constraints['LayoutSelfPosition']
                                && this.constraints['LayoutSelfPosition'] == Constraints.LayoutSelfPosition.Absolute)) {
            css = this.parentY ;
        }
        else {
            return null;
        }
        return css;
    }
    //
    get right() {
        // 暂不处理
        return null;
    }
    //
    get bottom() {
        // 暂不处理
        return null;
    }
    //
    get left() {
        let css = null;
        if (false) {
            // 这里是预留给fixed定位约束
            css = this._abX;
        }
        else if ((this.parent.constraints['LayoutPosition']
                    && this.parent.constraints['LayoutPosition'] == Constraints.LayoutPosition.Absolute) 
                        || (this.constraints['LayoutSelfPosition']
                                && this.constraints['LayoutSelfPosition'] == Constraints.LayoutSelfPosition.Absolute)) {
            css = this.parentX;
        }
        else {
            return null;
        }
        return css;
    }
    get position() {
        if(this._isAbsolute(this)){
            return "absolute";
        }else{
            return "relative";
        }
        // if (this.constraints["LayoutSelfPosition"] == Constraints.LayoutSelfPosition.Absolute) {
        //     return "absolute";
        // } else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Absolute) {
        //     return "relative";
        // }/*  else if (this.constraints["LayoutPosition"] == Constraints.LayoutPosition.Static) {
        //     return "static"
        // } */
    }
    //
    get marginTop() {
        let css = null;
        if(this._isAbsolute(this)){
            return css;
        }
        if (this._isParentHorizontal()) {   // 横排计算与父节点距离
            css = this._abY - this.parent._abY;
        }
        else {      // 竖排计算与上一节点距离
            let preNode = this._prevNode();

            if (preNode) {
                css = this._abY - preNode._abYops;
            }
            else {
                css = this._abY - this.parent._abY;
            }
        }
        return css;
    }
    //
    get marginRight() {
        // 暂不处理
        return null;
    }
    //
    get marginBottom() {
        // 暂不处理
        return null;
    }
    //
    get marginLeft() {
        let css = null;
        if(this._isAbsolute(this)){
            return css;
        }
        if (this._isParentHorizontal()) {   // 横排计算与上一节点距离
            let preNode = this._prevNode();

            if (preNode) {
                css = this._abX - preNode._abXops;
            }
            else {
                css = this._abX - this.parent._abX;
            }
        }
        else {      // 竖排计算与父节点距离
            css = this._abX - this.parent._abX;
        }
        return css;
    }
    //
    get zIndex() {
        return null;
    }
    //
    get color() {
        if (this.styles && this.styles.texts) {
            return this.getRGBA(this.styles.texts[0].color);
        }else{
            return null;
        }
    }

    get fontSize() {
        if (this.styles && this.styles.texts) {
            return this.transUnit(this.styles.texts[0].size);
        }else{
            return null;
        }
    }

    get lineHeight() {
        if (this.styles.lineHeight) {
            return this.styles.lineHeight;
        }else{
            return null;
        }
    }
    get opacity() {
        if (typeof this.styles.opacity == 'number') {
            return this.styles.opacity;
        }else{
            return null;
        }
    }

        /**
     * 获取线性渐变值
     * @param {Color} bgColor 背景色
     * @param {Number} width 宽度
     * @param {Number} height 高度
     */
    getLinearGradient(bgColor, width, height) {
        const from = {
            x: bgColor.x * width,
            y: bgColor.y * height
        };
        const to = {
            x: bgColor.x1 * width,
            y: bgColor.y1 * height
        };
        let stops = [];
        let rad = Math.atan((from.y - to.y) / (to.x - from.x))
        let angle = rad * 180 / Math.PI;
        angle += from.x > to.x ? -180 : 0
        let isHorizontal = angle % 180 == 0;
        bgColor.colorStops.forEach((stop) => {
            stops.push({
                color: this.getRGBA(stop.color),
                offset: stop.offset
            });
        });
        let gradientLength = Math.abs(isHorizontal ? (width / Math.cos(rad)) : (height / Math.sin(rad)));
        let linearLength = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
        let w = from.x < to.x ? from.x : (width - from.x),
            h = from.y < to.y ? from.y : (height - from.y)
        let beginLength = Math.abs(isHorizontal ? (w / Math.cos(rad)) : (h / Math.sin(rad)));
        stops.forEach((s) => {
            s.offset = (s.offset * linearLength + beginLength) / gradientLength
        });
        return `-webkit-linear-gradient(${angle}deg, ${stops.map((s) => {
            return s.color + ' ' + (s.offset * 100) + '%';
        }).join(',')})`;
    }

    get backgroundImage() {
        if (this.styles.background &&
            this.styles.background.type == 'linear') {
            return this.getLinearGradient(this.styles.background, this.width, this.height);
        } else if (this.path) {
            //01-03:图片路径
            return `url(../${this.path})`;
            //return `url(${this.path})`;
        }else{
            return null;
        }
    }
    get backgroundSize() {
        if (this.path) {
            return 'contain';
        }else{
            return null;
        }
    }
    getRGBA(color) {
        if (color && typeof color == 'object') {
            return 'rgba(' + [
                color.r,
                color.g,
                color.b,
                color.a,
            ].join(',') + ')'
        }
        return null;
    }

    /**
     * 单位换算
     * @param  {Number} number 数值
     * @param  {String} unit   单位类型，默认px
     * @return {String}        数值+单位
     */
    transUnit(number, unit = "rem") {
        number = parseInt(number) || 0;
        const dpr = 2;
        // 1-2像素特殊处理
        if (Math.abs(number) <= dpr) {
            number = Math.ceil(number / dpr);
            unit = 'px';
        }
        if (unit == 'rem') {
            return number / 100 + 'rem';
        } else {
            return number + 'px';
        }
    }
}


module.exports = {
    process,
    getCssString
}
