import Model from '../model';
import Dictionary from '../../helper/dictionary';
import Store from '../../helper/store';
class Image extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QImage;
  }
  static regular(node: any) {
    return node.type == 'QImage' || node.type == 'QShape';
  }
}

export default Image;
