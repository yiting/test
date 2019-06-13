// add.test.js
var sketch_map = require('./sketch_map.js');
const sketch_50 = require('./sketch_50')
const sketch_49 = require('./sketch_49')
var expect = require('chai').expect;

describe('sketchmap测试', function() {
  it('版本号大于50应该调用50基础版本', function() {
    expect(sketch_map.init_sketch('52.1')).to.be.an.instanceof(sketch_50)
  });
  it('版本号小于50应该调用49基础版本', function() {
    expect(sketch_map.init_sketch('37.1')).to.be.an.instanceof(sketch_49)
  });
  it('版本号为空应该调用50基础版本', function() {
    expect(sketch_map.init_sketch('')).to.be.an.instanceof(sketch_50)
  });
});
