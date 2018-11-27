let Dom = require("./dsl_dom.js");

/* 
    模型节点数验证
 */
function amountVerify(dom, textCountLimit, imageCountLimit, mixCountLimit) {
    let textCount = 0,
        imgCount = 0,
        mixCount = 0,
        mustCount = textCountLimit + imageCountLimit + (mixCountLimit < 0 ? 0 : mixCountLimit);
    dom.children.forEach(c => {
        if (c.type == Dom.type.TEXT && textCount < textCountLimit) {
            textCount++
        } else if (c.type == Dom.type.IMAGE && imgCount < imageCountLimit) {
            imgCount++
        } else {
            mixCount++;
        }
    });
    return dom.children.length >= mustCount &&
        textCount == textCountLimit &&
        imgCount == imageCountLimit &&
        // 如果混合元素等于-1，即为任意混合
        (mixCountLimit < 0 || mixCount == mixCountLimit);
}

// 判断是否符合模型
module.exports.is = function (model, dom, parent, Config) {
    return amountVerify(dom, model.textCount, model.imageCount, model.mixCount) &&
        model.is(dom, parent, Config)
}
// 根据模型调整结构
module.exports.adjust = function (model, dom, parent, Config) {
    dom.model = model.name; // 赋予模型名称
    dom.type = model.type; // 赋予模型类型
    if (dom.type == Dom.type.TEXT) {
        dom.styles.maxSize = dom.styles.maxSize || Math.max(...dom.children.map(c => c.styles.maxSize));
        dom.styles.minSize = dom.styles.minSize || Math.min(...dom.children.map(c => c.styles.minSize));
    }
    model.adjust(dom, parent, Config);
}