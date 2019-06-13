var sketch = require('./sketch_base.js');
var testModel = new sketch();
var expect = require('chai').expect;

var testJSON = {
  "_class": "rectangle",
  "do_objectID": "91D730B3-93D7-41DE-BF1C-18D2F0DF4E04",
  "booleanOperation": -1,
  "exportOptions": {
      "_class": "exportOptions",
      "do_objectID": "C27170EE-9932-4E17-B93B-DB3BD57998BF",
      "exportFormats": [],
      "includedLayerIds": [],
      "layerOptions": 0,
      "shouldTrim": false
  },
  "frame": {
      "_class": "rect",
      "do_objectID": "186EB8BE-45E7-4BE1-B9AD-9EF2CC3986B5",
      "constrainProportions": true,
      "height": 6.224873734152993,
      "width": 6.224873734152993,
      "x": 171.2892135623731,
      "y": 145.289213562373
  },
  "isFixedToViewport": false,
  "isFlippedHorizontal": false,
  "isFlippedVertical": false,
  "isLocked": false,
  "isVisible": true,
  "layerListExpandedType": 0,
  "name": "Rectangle 5 Copy",
  "nameIsFixed": false,
  "resizingConstraint": 63,
  "resizingType": 0,
  "rotation": 315,
  "shouldBreakMaskChain": false,
  "clippingMaskMode": 0,
  "hasClippingMask": false,
  "style": {
      "_class": "style",
      "do_objectID": "B309DE3F-881E-425C-9D5A-5BF930F482ED",
      "borders": [{
          "_class": "border",
          "isEnabled": false,
          "color": {
              "_class": "color",
              "alpha": 1,
              "blue": 0.592,
              "green": 0.592,
              "red": 0.592
          },
          "fillType": 0,
          "position": 1,
          "thickness": 1
      }],
      "endMarkerType": 0,
      "fills": [{
          "_class": "fill",
          "isEnabled": true,
          "color": {
              "_class": "color",
              "alpha": 1,
              "blue": 0.6235294117647059,
              "green": 0.9843137254901959,
              "red": 1
          },
          "fillType": 0,
          "noiseIndex": 0,
          "noiseIntensity": 0,
          "patternFillType": 0,
          "patternTileScale": 1
      }],
      "miterLimit": 10,
      "shadows": [{
          "_class": "shadow",
          "isEnabled": true,
          "blurRadius": 6,
          "color": {
              "_class": "color",
              "alpha": 1,
              "blue": 0.9100378787878788,
              "green": 0.9933637345050154,
              "red": 1
          },
          "contextSettings": {
              "_class": "graphicsContextSettings",
              "blendMode": 0,
              "opacity": 1
          },
          "offsetX": 0,
          "offsetY": 0,
          "spread": 3
      }],
      "startMarkerType": 0,
      "windingRule": 1
  }
}





describe('sketch基类获取可用属性测试', function() {
  it('是否具有_class', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('_class')
  });
  it('是否具有style', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('style')
  });
  it('是否具有rotation', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('rotation')
  });
  it('是否具有attributedString', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('attributedString')
  });
  it('是否具有frame', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('frame')
  });
  it('是否具有points', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('points')
  });
  it('是否具有hasBackgroundColor', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('hasBackgroundColor')
  });
  it('是否具有backgroundColor', function() {
    expect(testModel._getCanUseAttr(testJSON)).to.have.property('backgroundColor')
  });

});
describe('sketch基类获取可用样式测试', function() {
  it('是否具有borders', function() {
    expect(testModel._getCanUseStyle((testModel._getCanUseAttr(testJSON).style))).to.have.property('borders')
  });
  it('是否具有outterShadows', function() {
    expect(testModel._getCanUseStyle((testModel._getCanUseAttr(testJSON).style))).to.have.property('outterShadows')
  });
  it('是否具有innerShadows', function() {
    expect(testModel._getCanUseStyle((testModel._getCanUseAttr(testJSON).style))).to.have.property('innerShadows')
  });
  it('是否具有fills', function() {
    expect(testModel._getCanUseStyle((testModel._getCanUseAttr(testJSON).style))).to.have.property('fills')
  });
  it('是否具有textStyle', function() {
    expect(testModel._getCanUseStyle((testModel._getCanUseAttr(testJSON).style))).to.have.property('textStyle')
  });

})

// describe('sketch基类获取border测试',function(){
//   it('',function(){
//     expect().to.be.equal()
//   })
// })