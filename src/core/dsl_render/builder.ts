// 这里定义数据输出的统一接口
// h5, ios, android, weex等

import QLog from '../dsl_service_ts/helper/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

class Builder {
  _parseData() {
    const that: any = this;
  }

  getResult() {}

  _data: any;

  _tagString: string;

  _styleString: string;

  _options: any;

  constructor(data: any, options: any) {
    try {
      this._data = data; // 原始json数据
      this._options = options; // 布局样式
      // 解析json数据
      this._parseData();
    } catch (e) {
      Loger.error(`render/builder [constructor]:${e}`);
    }
  }
}

export default Builder;
