const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require("./dsl_store.js");

function fn(data) {
    data.contrains = {}
    data.contrains[CONTRAIN.LayoutSelfAbsolute] = true;
    data.contrains[CONTRAIN.LayoutFixedHeight] = true;
    data.contrains[CONTRAIN.LayoutFixedWidth] = true;
    data.contrains[CONTRAIN.LayoutSelfLeft] = true;
    data.contrains[CONTRAIN.LayoutSelfTop] = true;
    data.contrains[CONTRAIN.LayoutAbsolute] = true;

    if (data.children) {
        data.children.forEach(child => {
            fn(child);
        });
    }
}
let Config = {},
    Option = {
        structureMatching: .7
    }

module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    fn(data);
}