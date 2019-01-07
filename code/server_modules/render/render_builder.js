// 这里定义数据输出的统一接口
// h5, ios, android, weex等


class Builder {
    constructor(data, layoutType) {
        this._data = data;                  // 原始json数据
        this._tagString = "";               // 标签语言字符串
        this._styleString = "";             // 样式字符串
        this._layoutType = layoutType;      // 布局样式

        // 解析json数据
        this._parseData();
    }

    // 解析数据
    _parseData() {

    }

    //
    getTagString() {
        return this._tagString;
    }

    // 
    getStyleString() {
        return this._styleString;
    }
}


module.exports = Builder;
