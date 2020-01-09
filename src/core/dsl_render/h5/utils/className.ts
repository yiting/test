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
  let selfClassName: string = data._orignClassName;
  if (_classNameCache[selfClassName]) {
    selfClassName = selfClassName + '_' + _data.serialId;
  }
  _classNameCache[selfClassName] = true;
  _data._className = selfClassName;
  _data._classNameChain = [selfClassName];
  /**
   * 相似
   */
  if (_data.similarId) {
    let selfSimClassName: string = _simClassNameCache[_data.similarId];
    if (!selfSimClassName) {
      selfSimClassName = data._orignClassName + '_s' + _data.similarId;
      _simClassNameCache[_data.similarId] = selfSimClassName;
    }
    _classNameCache[selfSimClassName] = true;
    _data._simClassName = selfSimClassName;
    _data._simClassNameChain = [selfSimClassName];
  }
}

export function process(_data: any, _func: any) {
  _domCache = {};
  _classNameCache = {};

  goIn(_data, _func);
}
