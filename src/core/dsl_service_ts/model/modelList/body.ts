import Model from '../model';
import Dictionary from '../../helper/dictionary';
import Store from '../../helper/store';
class Body extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QBody;
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
  static regular(node: any) {
    return node.type == 'QLayer' || node.type == 'QBody';
  }
}

export default Body;
