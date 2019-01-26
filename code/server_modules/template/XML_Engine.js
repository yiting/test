class XML_Engine {
    // xml结构解析
    static parse() {
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
                    tag: Template._xmlTag(nd),
                    isCloseTag: Template._xmlIsCloseTag(nd),
                    attrs: Template._xmlAttr(nd),
                    children: []
                };
                curTpl.push(obj);
                if (!~nd.indexOf('/>')) {
                    // 如果非闭合节点
                    pen.unshift(obj);
                    curTpl = pen[0].children;
                }
            }
        });
        return rootTpl;
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

module.exports = XML_Engine;