let _domCache: any = {};
let _classNameCache: any = {};
let _simClassNameCache: any = {};

function goIn(_data: any, _func: any) {
  _func(_data);

  // 遍历下一层
  _data.children.forEach((d: any) => {
    goIn(d, _func);
  });
}
export function policy_oneName(_data: any) {
  let data: any = _data;
  // 缓存节点
  _domCache[data.id] = data;
  /**
   * 特性命名
   */
  let selfClassName: string = data.template.className;
  if (_classNameCache[selfClassName]) {
    selfClassName = selfClassName + '_' + _data.serialId;
  }
  _classNameCache[selfClassName] = true;
  _data.className = selfClassName;
  _data.classNameChain = [selfClassName];
  /**
   * 相似
   */
  if (_data.similarId) {
    let selfSimClassName: string = _simClassNameCache[_data.similarId];
    if (!selfSimClassName) {
      selfSimClassName = data.template.className + '_s' + _data.similarId;
      _simClassNameCache[_data.similarId] = selfSimClassName;
    }
    _classNameCache[selfSimClassName] = true;
    _data.simClassName = selfSimClassName;
    _data.simClassNameChain = [selfSimClassName];
  }
}

export function process(_data: any, _func: any) {
  _domCache = {};
  _classNameCache = {};

  goIn(_data, _func);
}
