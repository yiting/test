let Models = {};
[
    require("./model/text.js"),
    require("./model/image.js"),
    require("./model/poster.js"),
    require("./model/body.js"),
    require("./model/legend.js"),
    require("./model/block.js"),
    require("./model/column.js"),
    require("./model/inline.js"),
    require("./model/tag.js"),
    require("./model/textButton.js"),
    require("./model/paragraph.js"),
    require("./model/text-guide.js"),
    require("./model/layout-list-item.js"),
    require("./model/layout-equality.js"),
    require("./model/numerical.js"),
    require("./model/layout.js"),
    require("./model/layout-text.js"),
    require("./model/layout-image.js"),
    require("./model/iconEnter.js"),
    require("./model/iconButton.js"),
    require("./model/image-descript.js"),
    require("./model/pattern.js"),
    require("./model/layout-between.js"),
    require("./model/layout-flex.js"),
].forEach(m => {
    Models[m.name] = m
});

// 模型
module.exports.model = Models;
