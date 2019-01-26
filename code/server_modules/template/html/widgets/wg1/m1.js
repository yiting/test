//WG1M1模型：wg1-m1
/* const WG1M1 = {
    name: "wg1-m1",
    desc: "水平分割线",
    template: `
    <hr class="hr" :ref="0">
    </hr>`
}; */
const Template = require('../../../template');
class WG1M1 extends Template {
    constructor() {
        super(...arguments);
    }
    get template() {
        return `<hr class="hr" $ref="0"></hr>`
    }
}

module.exports = WG1M1;