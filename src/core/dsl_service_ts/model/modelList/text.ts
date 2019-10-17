import Model from '../model';
class Text extends Model {
  constructor(node: any) {
    super(node);
  }
  static regular(node: any) {
    return node.type == 'QText';
  }
}

export default Text;
