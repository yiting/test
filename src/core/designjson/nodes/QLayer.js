const QObject = require('./QObject');

class QLayer extends QObject {
  constructor() {
    super();
    this.type = QLayer.name;
  }
  get isRoot() {
    return this.parent == null;
  }
}
module.exports = QLayer;
