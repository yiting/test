let CONTRAIN = require('../dsl_contrain.js');
let STORE = require("../dsl_store.js");
/**
 * list
 */
module.exports.template = function () {

}
module.exports.is = function (dom, parent, option, config) {
    if (dom.children && dom.children.length >= 4) {
        let textArr = [], xDataArr = [], yDataArr = [];
        dom.children.find((child) => {
            //文本类型
            if (child.type == STORE.model.TEXT) {
                textArr.push(child)
            }
            //所有x坐标数据
            xDataArr.push(child.x);
            yDataArr.push(child.y);
        });
        //获取内部节点元素最小x值，作为最左侧元素
        let minX = Math.min.apply(Math, xDataArr);
        //获取内部节点元素最大x值，作为最右侧元素
        let maxX = Math.max.apply(Math, xDataArr);
        //获取对应图片和文本元素长度
        let txtLen = textArr.length;
        //第一个文本，最后一个文本
        let firstTxtWidth = 0.15 * config.page.width, lastTxtWidth = 0.26 * config.page.width;
        //子集元素布局
        for (let m = 0; m < xDataArr.length; m++) {
            //let currentDom = xDataArr[m];
            //真正给dom里面赋值
            let currentDom = dom.children[m];
            //所有元素左对齐
            currentDom.contrains[CONTRAIN.LayoutLeftMargin] = true;//左对齐
            currentDom.contrains[CONTRAIN.LayoutRightMargin] = false;//右对齐  false
            //根据位置:最外层两个元素位置
            //如果某个元素x坐标为最小值，则排序为最左侧
            //如果是文本,则设置一个宽度；如果是图片，则为本身宽度
            if (currentDom.x == minX && currentDom.type == STORE.model.TEXT) {
                //console.log("第一个文本")
                // currentDom.width = firstTxtWidth;
                //第一个文本（排名数字）水平居中
                //currentDom.contrains = {};
                currentDom.contrains[CONTRAIN.LayoutHorizontal] = true;//水平
                currentDom.contrains[CONTRAIN.LayoutJustifyContentCenter] = true;//居中
                currentDom.contrains[CONTRAIN.LayoutLeftMargin] = true;//左对齐
                currentDom.contrains[CONTRAIN.LayoutRightMargin] = false;//右对齐  false
            }

            //如果某个元素x坐标为最大值，则排序为最右侧
            if (currentDom.x == maxX) {
                //console.log("当前坐标:" + currentDom.type)
                // currentDom.width = lastTxtWidth;
                //最后一个文本（步数数字或达标说明）向右对齐
                currentDom.contrains[CONTRAIN.LayoutHorizontal] = true;//水平
                currentDom.contrains[CONTRAIN.LayoutJustifyContentEnd] = true;//居右
                //属性对齐方式
                currentDom.contrains[CONTRAIN.LayoutRightMargin] = true;//右对齐 true
                currentDom.contrains[CONTRAIN.LayoutLeftMargin] = false;//左对齐
            }

            //根据元素类型:当前元素是文本，且x坐标，处于最小值x和最大值x之间
            if (currentDom.x > minX && currentDom.x < maxX && currentDom.type == STORE.model.TEXT) {
                //自适应flex
                currentDom.contrains[CONTRAIN.LayoutAutoFlex] = true;//自适应宽度
            }
        }

        //父级元素布局
        if (txtLen >= 1) {
            //console.log("list0")
            //至少两个文本
            dom.type = STORE.model.LIST0;
            //当前父级元素布局
            dom.contrains = {};
            dom.contrains[CONTRAIN.LayoutHorizontal] = true;//水平
            dom.contrains[CONTRAIN.LayoutJustifyContentStart] = true;//对齐方式
            dom.contrains[CONTRAIN.LayoutAlignItemsCenter] = true;//右边距
            return true;
        }
    }
}