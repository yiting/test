const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};
import CssProperty from '../utils/css_property';

export default {
  key: 'justifyContent',
  value() {
    if (this.display === 'flex') {
      return (
        flexValue[this.constraints.LayoutJustifyContent] ||
        CssProperty.default.justifyContent
      );
    } else {
      return CssProperty.default.justifyContent;
    }
  },
};
