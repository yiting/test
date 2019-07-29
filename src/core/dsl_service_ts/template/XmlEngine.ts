import QLog from '../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

class XmlEngine {
  // xml结构解析
  static parse(temp: string) {
    const rootTpl: any[] = [];
    try {
      let curTpl: any = rootTpl;
      const pen: any = [rootTpl];
      temp.match(/<[\s\S]*?>/gim).forEach((nd: any) => {
        // 结束节点
        if (~nd.indexOf('</')) {
          const obj = pen.shift();
          curTpl = pen[0].children;
        } else {
          // 普通节点
          const tagName = XmlEngine._xmlTag(nd);
          const isClosedTag = XmlEngine._xmlIsCloseTag(nd);
          const attrs = XmlEngine._xmlAttr(
            nd.slice(
              nd.indexOf(tagName) + tagName.length,
              nd.indexOf(isClosedTag ? '/>' : '>'),
            ),
          );
          const children: any[] = [];
          const obj = {
            tagName,
            isClosedTag,
            attrs,
            children,
          };
          curTpl.push(obj);
          if (!isClosedTag) {
            // 如果非闭合节点
            pen.unshift(obj);
            curTpl = pen[0].children;
          }
        }
      });
    } catch (e) {
      Loger.debug(`XmlEngine [parse] params[temp:${temp}]`);
    }
    return rootTpl;
  }

  /**
   * 标签解析
   * @param str
   */
  static _xmlTag(str: string) {
    // 替换括号前空白，替换其他内容直到括号为空白
    return str
      .replace(/(^\s+)|(\s+$)/gim, '')
      .replace(/\s[\S\s]*>|\/>|>/gim, '')
      .slice(1);
  }

  static _xmlIsCloseTag(str: string) {
    return !!~str.indexOf('/>');
  }

  static _xmlAttr(str: string) {
    const obj: any = {};
    const matchedAttrs = str.match(
      /[^\s]+=(("[\s\S]*?")|('[\s\S]*?'))|[^\s]+/gim,
    );

    if (matchedAttrs) {
      matchedAttrs.forEach((val: any) => {
        const m = val.split('=');
        const key = m[0];
        const value = m[1] && m[1].slice(1, -1); // 剔除前后双引号
        obj[key] = value;
      });
    }
    return obj;
  }
}

export default XmlEngine;
