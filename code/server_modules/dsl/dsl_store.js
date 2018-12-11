let Models = {};
[
    // base
    require("./model/text.js"),
    require("./model/image.js"),
    require("./model/body.js"),
    require("./model/paragraph.js"),
    require("./model/spacer.js"),
    require("./model/pattern.js"),
    require("./model/segmenting.js"),
    // 1
    require("./model/tag.js"),
    require("./model/textButton.js"),
    // 2
    require("./model/legend.js"), // h:icon+text(0)
    require("./model/iconButton.js"), // h:icon+text(1)
    require("./model/text-guide.js"), // h:text+icon
    require("./model/numerical.js"), // a:text+text(s)
    require("./model/image-descript-h.js"), //h:img+text
    require("./model/image-descript-v.js"), //v:img+text
    // -10
    require("./model/layout-inline.js"), // h:-10
    require("./model/layout-equality.js"), // h:-10
    require("./model/layout-between.js"), //mix:-10
    require("./model/layout-flex.js"), //mix:-10
    // -20
    require("./model/layout-text.js"), //mix:-20
    require("./model/layout-image.js"), //mix:-20
    // default
    // require("./model/inline.js"),
    require("./model/block.js"),
    require("./model/column.js"),
].forEach(m => {
    Models[m.name] = m
});

// 模型
module.exports.model = Models;