import HtmlTemplate from '../../htmlTemplate';
import Constraints from '../../../../helper/constraints';
import Common from '../../../../dsl2/common';

class EM1M1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    const that = this;
    const texts = this._renderData.styles && this._renderData.styles.texts;
    if (texts && texts.length > 0) {
      const children: any[] = [];
      texts.forEach((text: any, i: number) => {
        if (i === 0) return;
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
      const firstText = texts[0];
      this._renderData.styles.texts = [firstText];
      this._renderData.children = children;
      this._renderData.text = firstText.string;
      this._renderData.constraints['LayoutDirection'] =
        Constraints.LayoutDirection.Horizontal;
    }

    this._template = '<span :class="textClassName()"></span>';
  }
}

export default EM1M1;
