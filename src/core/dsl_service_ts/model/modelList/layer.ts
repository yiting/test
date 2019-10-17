import Model from '../model';
import Dictionary from '../../helper/dictionary';
import Store from '../../helper/store';
class Layer extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QLayer;
  }
  static regular(node: any) {
    return node.type == 'QLayer' || node.type == 'QBody';
  }
}

export default Layer;
