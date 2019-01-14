class engine {
    constructor(template) {
        this._symbol = {
            order: '@',
            var: ':',
            attr: '',
        }
    }
    // 模板解析
    _xmlParser(temp) {
        let list = [], cr = list, pen = [];
        temp.replace(/<.*?>/img, function (nd) {
            // 结束节点
            if (~nd.indexOf('</')) {
                let obj = pen.pop();
                cr = obj.children;
            } else {
                let obj = {
                    _tpl: nd,
                    children: []
                }
                cr.push(obj);
                if (!~nd.indexOf('/>')) {
                    pen.push(obj);
                    cr = obj.children;
                }
            }
        });
        return list;
    }
    _xmlTag(str) {
        return str.slice(1, str.indexOf(' '))
    }
    _xmlAttr(str) {
        let obj = {};
        return str.replace(/[^\s]+=(\{.*?\}|[^\s]+)/img, function (val) {
            let m = val.split('=');
            obj[m[0]] == m[1];
        })
    }
}