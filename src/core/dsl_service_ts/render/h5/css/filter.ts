import Funcs from '../function/css_func';
import CssDefault from '../model/css_default';

export default {
  key: 'filter',
  value() {
    if (this.styles && this.styles.shadows) {
      const filter: any[] = [];
      this.styles.shadows.forEach((s: any) => {
        filter.push(
          `drop-shadow(${[
            Funcs.transUnit(s.x),
            Funcs.transUnit(s.y),
            Funcs.transUnit(s.blur),
            Funcs.getRGBA(s.color),
          ].join(' ')})`,
        );
      });
      return filter.join(' ');
    }
    return CssDefault.filter;
  },
};
