import Model from '../model';
import Dictionary from '../../helper/dictionary';
import Store from '../../helper/store';
class Layer extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QLayer;
  }
}

export default Layer;
