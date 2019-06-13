const QObject = require('./QObject');

class QLayer extends QObject {
  constructor() {
    super();
    this.type = QLayer.name;
  }
  get isRoot() {
    return this.parent == null;
  }
  get pureColor() {
    const { styles } = this;
    if (styles.background && styles.background.type === 'color')
      return styles.background.color;
    else return null;
  }
}
module.exports = QLayer;
