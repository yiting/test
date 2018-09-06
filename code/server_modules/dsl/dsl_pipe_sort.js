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
        if (d.y < newDom.y + newDom.height && newDom.y < d.y + d.height) {
            dCenter = d.x + d.width / 2;
            newCenter = newDom.x + d.width / 2;
        } else {
            dCenter = d.y + d.height / 2;
            newCenter = newDom.y + newDom.height / 2;
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