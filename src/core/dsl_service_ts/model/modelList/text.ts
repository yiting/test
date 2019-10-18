import Model from '../model';
class Text extends Model {
  constructor(node: any) {
    super(node);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }
  static regular(node: any) {
    return node.type == 'QText';
  }
}

export default Text;
