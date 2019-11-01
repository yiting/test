import HtmlTemplate from '../../../../dsl_service_ts/template/html/htmlTemplate';
import Constraints from '../../../../dsl_service_ts/helper/constraints';
import Dictionary from '../../../../dsl_service_ts/helper/dictionary';
import TextModel from '../../../../dsl_extend/models/text/model';

class Text extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    const that = this;
    // if(this._renderData.id=='3D6DE57E-88DE-45B5-AE38-E1C8B6CB9000')debugger
    // if(this._renderData.id=='3D6DE57E-88DE-45B5-AE38-E1C8B6CB9000')debugger
    const texts = this._renderData.styles && this._renderData.styles.texts;
    if (texts && texts.length > 1) {
      const children: any[] = [];
      texts.forEach((text: any, i: number) => {
        // if (i === 0) return;
        children.push(
          new TextModel({
            id: that._renderData.id + '_' + i,
            type: Dictionary.type.QText,
            parent: this._renderData,
            modelName: 'Text',
            constraints: {
              LayoutFixedWidth: 'default',
            },
            styles: {
              lineHeight: this._renderData.styles.lineHeight,
              texts: [text],
            },
            text: text.string,
          }),
        );
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
