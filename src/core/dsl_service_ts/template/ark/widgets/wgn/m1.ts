import ArkTemplate from '../../arkTemplate';

class CYCLE01 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<View class="list">
          <View $each class="item">
          </View>
      </View>`;
  }
}
export default CYCLE01;
