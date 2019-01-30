const QLog = require("../log/qlog");
const Loger = QLog.getInstance(QLog.moduleData.render);

class XML_Engine {
    // xml结构解析
    static parse(temp) {
        try {
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
                    let tagName = XML_Engine._xmlTag(nd),
                        isClosedTag = XML_Engine._xmlIsCloseTag(nd),
                        attrs = XML_Engine._xmlAttr(nd.slice(
                            nd.indexOf(tagName) + tagName.length,
                            nd.indexOf(isClosedTag ? '/>' : '>')
                        ));
                    let obj = {
                        tagName,
                        isClosedTag,
                        attrs,
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
        } catch (e) {
            Loger.debug(`XML_Engine [parse] params[temp:${temp}]`)
        }
    }
    // 标签解析
    static _xmlTag(str) {
        // 替换括号前空白，替换其他内容直到括号为空白
        return str.replace(/(^\s+)|(\s+$)/img, '').replace(/\s[\S\s]*>|\/>|>/img, '').slice(1);
    }
    static _xmlIsCloseTag(str) {
        return !!~str.indexOf('/>');
    }
    static _xmlAttr(str) {
        let obj = {},
            attrMatch = str.match(/[^\s]+=((".*?")|('.*?'))|[^\s]+/img)
        attrMatch && attrMatch.forEach(val => {
            let m = val.split('='),
                key = m[0],
                value = m[1] && m[1].slice(1, -1); //剔除前后双引号
            obj[key] = value;
        });
        return obj;
    }
}

module.exports = XML_Engine;