/**
 * sketch版本与sketch属性处理类的隐射关系，用于处理版本兼容性。
 * 对应的版本不同，获取处理属性的方式也不同
 */
const sketch_50 = require('./sketch_50');
const sketch_49 = require('./sketch_49');
SKETCH_MAP = {
  '50': sketch_50,
  '49': sketch_49,
};
/**
 *
 * @param {String} version sketch版本号
 */
const init_sketch = function(version) {
  if (!version) {
    return new SKETCH_MAP['50']();
  }
  let _version = '0';
  if (_verA_LowerThan_verB(version, '50')) {
    _version = '49';
  } else {
    _version = '50';
  }
  return new SKETCH_MAP[_version]();
};
function _verA_LowerThan_verB(a, b) {
  (a = a.split('.')), (b = b.split('.'));
  let l = Math.max(a.length, b.length);
  for (let i = 0; i < l; i++) {
    let A = a[i] === undefined ? 0 : +a[i];
    let B = b[i] === undefined ? 0 : +b[i];
    if (A === B) continue;
    else return A < B; //
  }
  return false;
}
// 对外接口
module.exports = {
  SKETCH_MAP,
  init_sketch,
};
