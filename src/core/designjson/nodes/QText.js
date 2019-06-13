const QObject = require('./QObject');

class QText extends QObject {
  constructor() {
    super();
    this.type = QText.name;
    this.text = '';
  }
  get pureColor() {
    try {
      // 获取文字纯色 阴影TODO
      const { texts } = this.styles;
      let isSameColor = (a, b) =>
        Object.values(a).join(',') === Object.values(b).join(',');
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          if (!isSameColor(texts[i]['color'], texts[j]['color'])) return null;
        }
      }
      return texts[0]['color'];
    } catch (error) {}
    // TODO
  }
}
module.exports = QText;
