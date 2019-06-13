//EMXM1模型：多文本单行元素，inline
const HtmlTemplate = require('../../htmlTemplate');
class EMXMX extends HtmlTemplate {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `
        <div class="inline" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <span $each $useTag></span>
        </div>`
    }
}

module.exports = EMXMX;