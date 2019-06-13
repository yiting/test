const QObject = require('./QObject');
class QShape extends QObject {
  constructor() {
    super();
    this.type = QShape.name;
    this.shapeType = 'rectangle';
  }

  get colorComplexity() {
    const { styles } = this;
    if (!styles) return 0;
    if (styles.background) {
      // styles.background.type
    }
    return styles.background.color === this.border.color;
  }

  get pureColor() {
    const { styles } = this;
    if (
      styles.background &&
      styles.background.type === 'color' &&
      !styles.border
    )
      return styles.background.color;
    return null;
  }
}
module.exports = QShape;
