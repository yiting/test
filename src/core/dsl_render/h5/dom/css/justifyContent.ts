const flexValue: any = {
  Start: 'flex-start',
  End: 'flex-end',
  Center: 'center',
};
import { defaultProperty as cssDefaultProperty } from '../propertyMap';

export default {
  key: 'justifyContent',
  value() {
    if (this.display === 'flex' || this.display === 'inline-flex') {
      return (
        flexValue[this.constraints.LayoutJustifyContent] ||
        cssDefaultProperty.justifyContent
      );
    } else {
      return cssDefaultProperty.justifyContent;
    }
  },
};
