/**
 * sort
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
const Dom = require("./dsl_dom.js");

/* function fn(json) {
    if (json.children) {
        let children = [];
        json.children.forEach((j, i) => {
            fn(j);
            _sort(j, children);
        });
        json.children = children;
    }
}

function _sort(newDom, children) {
    if (!children.length) {
        children.push(newDom);
        return;
    }
    let done = children.some((d, i) => {
        let dCenter, newCenter;
        let newDom_y = newDom.textAbY || newDom.abY,
            newDom_h = newDom.textHeight || newDom.height,
            d_y = d.textAbY || d.abY,
            d_h = d.textHeight || d.height
        // 水平关系
        if (d_y < newDom_y + newDom_h && newDom_y < d_y + d_h) {
            dCenter = d.abX + d.width / 2;
            newCenter = newDom.abX + d.width / 2;
        } else {
            // 垂直关系
            dCenter = d_y + d_h / 2;
            newCenter = newDom_y + newDom_h / 2;
        }
        if (newCenter < dCenter) {
            children.splice(i, 0, newDom);
            return true;
        }
    });
    if (!done) {
        children.push(newDom);
    }
} */
function fn(json) {
    if (json.children) {
        json.children.forEach(fn);
        json.children = json.children.sort((a, b) => {
            // 如果是同一水平上
            if (Dom.isHorizontal([a, b])) {
                return a.abX - b.abX;
            } else {
                return a.abY - b.abY;
            }
        });
    }
}
module.exports = function (data) {
    return fn(data);
}