let unitSetting = {
  /**
   * 单位转换
   */
  unitSize: function(length, isText) {
    //var length = Math.round((length / TOSEEConfig.scale) * 10) / 10,
    var length =
      Math.round((length / TOSEEConfig.scale) * Math.pow(10, 2)) /
      Math.pow(10, 2);
    (units = TOSEEConfig.unit.split("/")), (unit = units[0]);
    if (units.length > 1 && isText) {
      unit = units[1];
    }
    return length + unit;
  },
  /**
   * 初始化单位面板
   */
  initUnit: function() {
    let _this = this;
    (unitsData = [
      {
        units: [
          {
            name: "标准",
            unit: "px",
            scale: 1
          }
        ]
      },
      {
        name: "iOS",
        units: [
          {
            name: "Points" + " @1x",
            unit: "pt",
            scale: 1
          },
          {
            name: "Retina" + " @2x",
            unit: "pt",
            scale: 2
          },
          {
            name: "Retina HD" + " @3x",
            unit: "pt",
            scale: 3
          }
        ]
      },
      {
        name: "Android",
        units: [
          {
            name: "LDPI @0.75x",
            unit: "dp/sp",
            scale: 0.75
          },
          {
            name: "MDPI @1x",
            unit: "dp/sp",
            scale: 1
          },
          {
            name: "HDPI @1.5x",
            unit: "dp/sp",
            scale: 1.5
          },
          {
            name: "XHDPI @2x",
            unit: "dp/sp",
            scale: 2
          },
          {
            name: "XXHDPI @3x",
            unit: "dp/sp",
            scale: 3
          },
          {
            name: "XXXHDPI @4x",
            unit: "dp/sp",
            scale: 4
          }
        ]
      },
      {
        name: "Web",
        units: [
          {
            name: "CSS Rem 12px",
            unit: "rem",
            scale: 12
          },
          {
            name: "CSS Rem 14px",
            unit: "rem",
            scale: 14
          },
          //系统默认的
          {
            name: "CSS Rem 56px",
            unit: "rem",
            scale: 56
          }
        ]
      }
    ]),
      (unitHtml = []),
      (unitList = []),
      (unitCurrent = ""),
      (hasCurrent = "");
    $.each(unitsData, function(index, data) {
      if (data.name)
        unitList.push('<li class="sub-title">' + data.name + "</li>");
      $.each(data.units, function(index, unit) {
        var checked = "";
        if (unit.unit == TOSEEConfig.unit && unit.scale == TOSEEConfig.scale) {
          checked = ' checked="checked"';
          hasCurrent = unit.name;
        }
        unitList.push(
          '<li><label><input type="radio" name="resolution" data-name="' +
            unit.name +
            '" data-unit="' +
            unit.unit +
            '" data-scale="' +
            unit.scale +
            '"' +
            checked +
            "><span>" +
            unit.name +
            "</span></label></li>"
        );
      });
    });
    if (!hasCurrent) {
      unitCurrent =
        '<li><label><input type="radio" name="resolution" data-name="' +
        "Custom" +
        " (" +
        TOSEEConfig.scale +
        ", " +
        TOSEEConfig.unit +
        ')" data-unit="' +
        TOSEEConfig.unit +
        '" data-scale="' +
        TOSEEConfig.scale +
        '" checked="checked"><span>' +
        "Custom" +
        " (" +
        TOSEEConfig.scale +
        ", " +
        TOSEEConfig.unit +
        ")</span></label></li>";
      hasCurrent =
        "Custom" + " (" + TOSEEConfig.scale + ", " + TOSEEConfig.unit + ")";
    }
    unitHtml.push(
      '<div class="overlay"></div>',
      "<h3>" + "分辨率" + "</h3>",
      "<p>" + hasCurrent + "</p>",
      "<ul>",
      unitCurrent,
      unitList.join(""),
      "</ul>"
    );
    $("#unit").html(unitHtml.join(""));

    //监听unit
    $("#unit")
      .on("change", "input[name=resolution]", function() {
        var $checked = $("input[name=resolution]:checked");
        TOSEEConfig.unit = $checked.attr("data-unit");
        TOSEEConfig.scale = Number($checked.attr("data-scale"));
        $("#unit")
          .blur()
          .find("p")
          .text($checked.attr("data-name"));
        //重新设置对应的单位转换
        _this.resetUnit();
      })
      .on("click", "h3, .overlay", function() {
        $("#unit").blur();
      });
  },
  resetUnit: function() {
    let _this = this;
    let needChangeDomList1 = $("#screen")
      .contents()
      .find('*[data-need="unit"]');
    let needChangeDomList2 = $('*[data-need="unit"]');
    _this.domChangeUnit(needChangeDomList1);
    _this.domChangeUnit(needChangeDomList2);
  },
  domChangeUnit: function(domList) {
    let _this = this;
    domList.each(function() {
      let _thisDom = $(this);
      let _thisDomVal = parseFloat(_thisDom.data("real"));
      let fontAttrFlag = false;
      if (_thisDom.data("needFont")) {
        fontAttrFlag = true;
      }
      _thisDomVal = _this.unitSize(_thisDomVal, fontAttrFlag);
      _thisDom.val(_thisDomVal).text(_thisDomVal);
    });
  }
};
