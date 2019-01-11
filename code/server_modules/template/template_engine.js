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
        let list = [], pen = [];
        temp.replace(/(<[^/]*?>)|(<\/.*?>)/img, function (nd) {
            // 结束节点
            if (~nd.indexOf('</')) {
                let obj = pen.pop();
                list = obj._cr;
            } else {
                let obj = {
                    _tpl: nd,
                    _cr: []
                }
                list.push(obj);
                if (!~nd.indexOf('/>')) {
                    pen.push(obj);
                    list = obj._cr;
                }
            }
        })
    }
}