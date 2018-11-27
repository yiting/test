let Common = require("./dsl_common.js");
let index = 0;
class CSSDom {
    constructor(o = {}, ...extend) {
        Object.assign(o, ...extend);
        // this.id = Common.guid();
        this.id = 'css' + index++;
        this.path = o.path || null;
        this.background = o.background || null;
        this.lineHeight = o.lineHeight || null;
        this.border = o.border || null;
        this.shadows = o.shadows || null;
        this.borderRadius = o.borderRadius || null;
        this.rotation = o.rotation || null;
        this.opacity = o.opacity || 1;
        this.blending = o.blending || null;
        this.textAlign = o.textAlign || 0;
        this.maxSize = o.texts ? Math.max(...o.texts.map(t => t.size)) : null;
        this.minSize = o.texts? Math.min(...o.texts.map(t=>t.size)):null;
    }
    get className() {
        return
    }
    toCSS() {

    }
}
// 对齐方式
CSSDom.align = {
    "left": 0,
    "right": 1,
    "center": 2
}

CSSDom.fontWeight = {
    "thin": 100, //Thin
    "extra": 200, //Extra Light (Ultra Light)
    "light": 300, //Light
    "regular": 400, //Regular (Normal、Book、Roman)
    "medium": 500, //Medium
    "semibold": 600, //Semi Bold (Demi Bold)
    "bold": 700, //Bold
    "extra": 800, //Extra Bold (Ultra Bold)
    "black": 900, //Black (Heavy)
}
module.exports = CSSDom;