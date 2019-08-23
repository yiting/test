import ArkTemplate from '../../arkTemplate';

class CYCLE01 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<View size margin anchors>
          <View $each size margin anchors>
          </View>
      </View>`;
  }
}
export default CYCLE01;
