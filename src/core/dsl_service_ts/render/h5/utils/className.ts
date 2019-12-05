let _domCache: any = {};
let _classNameCache: any = {};

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
  let selfClassName: string = data.tplAttr.class || data.tagName;
  if (_classNameCache[selfClassName]) {
    selfClassName = selfClassName + '_' + _data.serialId;
  }
  let selfSimClassName: string =
    (data.tplAttr.class || data.tagName) + '_s' + _data.similarId;
  _classNameCache[selfClassName] = true;
  _classNameCache[selfSimClassName] = true;

  _data.className = selfClassName;
  _data.simClassName = selfSimClassName;
  _data.classNameChain = [selfClassName];
  _data.simClassNameChain = [selfSimClassName];
}

export function process(_data: any, _func: any) {
  _domCache = {};
  _classNameCache = {};

  goIn(_data, _func);
}
