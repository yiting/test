import ArkTemplate from '../../arkTemplate';
import Constraints from '../../../../helper/constraints';
import Common from '../../../../dsl2/common';

class EM1M1 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    const that = this;
    const texts = this._renderData.styles && this._renderData.styles.texts;
    if (texts && texts.length > 1) {
      const children: any[] = [];
      texts.forEach((text: any, i: number) => {
        // if (i === 0) return;
        children.push({
          id: that._renderData.id + '_' + i,
          type: Common.QText,
          modelName: 'em1-m1',
          constraints: {
            LayoutFixedWidth: 'default',
          },
          styles: {
            lineHeight: this._renderData.styles.lineHeight,
            texts: [text],
          },
          text: text.string,
        });
      });
      this._renderData.children = children;
      this._renderData.styles.texts = [];
      this._renderData.constraints['LayoutDirection'] =
        Constraints.LayoutDirection.Horizontal;
    }
    const text =
      this._renderData.styles.texts && this._renderData.styles.texts[0].string;
    if (text) {
      this._template = `<Text value="${text}"></Text>`;
    } else {
      this._template = `<Text></Text>`;
    }
  }
}

export default EM1M1;
