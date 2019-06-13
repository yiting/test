const QObject = require('./QObject');

class QImage extends QObject {
  constructor() {
    super();
    this.type = QImage.name;
    this.path = '';
  }
}
module.exports = QImage;
