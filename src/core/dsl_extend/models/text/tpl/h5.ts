import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';
import Constraints from '../../../../dsl_service_ts/helper/constraints';
import Dictionary from '../../../../dsl_service_ts/helper/dictionary';

class Text extends HtmlTemplate {
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
          type: Dictionary.type.QText,
          modelName: 'Text',
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

    this._template = '<span :class="textClassName()"></span>';
  }
}

export default Text;
