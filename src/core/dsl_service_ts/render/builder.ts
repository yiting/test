// 这里定义数据输出的统一接口
// h5, ios, android, weex等

import QLog from '../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

class Builder {
  _parseData() {
    // throw new Error('Method not implemented.');
    const that: any = this;
  }

  _data: any;

  _tagString: string;

  _styleString: string;

  _options: any;

  constructor(data: any, options: any) {
    try {
      this._data = data; // 原始json数据
      this._tagString = ''; // 标签语言字符串
      this._styleString = ''; // 样式字符串
      this._options = options; // 布局样式
      // 解析json数据
      this._parseData();
    } catch (e) {
      Loger.error(`builder.js [constructor]:${e}`);
    }
  }

  // 解析数据
  // _parseData() {}

  //
  getTagString() {
    return this._tagString;
  }

  //
  getStyleString() {
    return this._styleString;
  }
}

export default Builder;
