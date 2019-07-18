import HtmlTemplate from '../../htmlTemplate';

class CYCLE01 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `<View>
          <View $each class="item">
          </View>
      </View>`;
  }
}
export default CYCLE01;
