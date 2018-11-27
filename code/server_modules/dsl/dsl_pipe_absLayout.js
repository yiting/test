const CONTRAIN = require('./dsl_contrain.js');
const Logger = require('./logger');

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
    Option = {}

module.exports = function (data) {
    Logger.debug("[pipe absoute layout] start");
    Config = this.attachment.config;
    fn(data);
}