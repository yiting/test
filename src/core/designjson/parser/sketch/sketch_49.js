const Sketch = require('./sketch_base');
const NSArchiveParser = require('./NSArchiveParser/index');
class Sketch49 extends Sketch {
  /**
   *
   * @param {*} textStyle
   * @param {*} attributedString
   */
  _getFont(textStyle, attributedString) {
    const textValue = attributedString.string;
    function fontStyle(ops = {}) {
      let {
        color = { r: 0, g: 0, b: 0, a: 1 },
        string = '',
        font,
        size = 18,
      } = ops;
      this.color = color;
      this.string = string;
      this.font = font;
      this.size = size;
    }
    if (
      attributedString.archivedAttributedString &&
      attributedString.archivedAttributedString['_archive']
    ) {
      let data = attributedString.archivedAttributedString['_archive'];
      let { NSString, NSAttributes } = NSArchiveParser(data);
      const {
        NSFontNameAttribute: fontName,
        NSFontSizeAttribute: size,
      } = NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes;
      return {
        texts: [
          new fontStyle({
            color: this._getColor(
              NSAttributes.MSAttributedStringColorDictionaryAttribute,
            ),
            string: NSString,
            font: fontName,
            size,
          }),
        ],
      };
    }

    // if (!attributedString.archivedAttributedString || !attributedString.archivedAttributedString['_archives']) return { texts: [new fontStyle()] }
    return { texts: [new fontStyle()] };
  }
}
// 对外接口
module.exports = Sketch49;
