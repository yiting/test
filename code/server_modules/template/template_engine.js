// 假设模板
const __tpl = `
<div class="${this.className}">
    <span $ref="0" style="background-image:url(${this.$ref[0].path})"></span>
    // $ref="绑定引用"
    // :src="绑定节点变量"
    <img $ref="1" :src="$ref[1].src"/>
</div>`


class Template {
    constructor(data, config) {
        this._symbol = {
            order: '@',
            var: ':',
            attr: '',
        }
        this._data = data;
        this.$ref = data.nodes;
        /**
         * 主流程
         * */

    }
    // 模板解析
    _xmlParser() {
        let structure = Template._xmlStructure(this.tpl);
        structure
    }
    // xml结构解析
    static _xmlStructure() {
        let rootTpl = [],
            curTpl = rootTpl,
            pen = [rootTpl];
        temp.match(/<.*?>/img).forEach(nd => {
            // 结束节点
            if (~nd.indexOf('</')) {
                let obj = pen.shift();
                curTpl = pen[0].children;
            } else {
                // 普通节点
                let obj = {
                    _tpl: nd,
                    children: []
                }
                curTpl.push(obj);
                if (!~nd.indexOf('/>')) {
                    // 如果非闭合节点
                    pen.unshift(obj);
                    curTpl = pen[0].children;
                }
            }
        });
        return rootTpl[0];
    }
    // 标签解析
    static _xmlTag(str) {
        return str.slice(1, str.indexOf(' '))
    }
    static _xmlIsCloseTag(str) {
        return ~str.indexOf('/>');
    }
    static _xmlAttr(str) {
        let obj = {};
        str.match(/[^\s]+=(\{.*?\}|[^\s]+)/img).forEach(val => {
            let m = val.split('='),
                key = m[0],
                value = m[1].slice(1, -1); //剔除前后双引号
            obj[key] = value;
        });
        return obj;
    }
}