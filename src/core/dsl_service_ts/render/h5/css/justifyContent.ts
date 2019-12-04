const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};
import CssDefault from '../model/css_default';

export default {
  key: 'justifyContent',
  value() {
    if (this.display === 'flex') {
      return (
        flexValue[this.constraints.LayoutJustifyContent] ||
        CssDefault.justifyContent
      );
    } else {
      return CssDefault.justifyContent;
    }
  },
};
