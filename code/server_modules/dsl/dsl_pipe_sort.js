/**
 * sort
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */

function fn(json) {
    if (json.children) {
        let children = [];
        json.children.forEach((j, i) => {
            fn(j);
            _sort(j, children);
        });
        json.children = children;
        // children.forEach((j, i) => {
        // })
    }
}

function _sort(newDom, children) {
    if (!children.length) {
        children.push(newDom);
        return;
    }
    let done = children.some((d, i) => {
        let dCenter, newCenter;
        let newDom_y = newDom.textAbY||newDom.abY,
            newDom_h = newDom.textHeight||newDom.height,
            d_y = d.textAbY||d.abY,
            d_h = d.textHeight||d.height
        if (d_y < newDom_y + newDom_h && newDom_y < d_y + d_h) {
            dCenter = d.abX + d.width / 2;
            newCenter = newDom.abX + d.width / 2;
        } else {
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
}
let Config = {},
    Option = {}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    return fn(data);
}