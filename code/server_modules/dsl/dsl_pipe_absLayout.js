const CONTRAIN = require('./dsl_contrain.js');
const Common = require('./dsl_common.js');
const Store = require("./dsl_store.js");

function fn(data) {
    data.contrains = {}
    data.contrains["LayoutSelfPosition"] = CONTRAIN.LayoutSelfPosition.Absolute;
    data.contrains["LayoutFixedHeight"] = CONTRAIN.LayoutFixedHeight.Fixed;
    data.contrains["LayoutFixedWidth"] = CONTRAIN.LayoutFixedWidth.Fixed;
    data.contrains["LayoutSelfHorizontal"] = CONTRAIN.LayoutSelfHorizontal.Left;
    data.contrains["LayoutSelfVertical"] = CONTRAIN.LayoutSelfVertical.Top;
    data.contrains["LayoutPosition"] = CONTRAIN.LayoutPosition.Absolute;
    data.contrains["LayoutDirection"] = CONTRAIN.LayoutDirection.Default;

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