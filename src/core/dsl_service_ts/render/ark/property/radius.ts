export default {
  key: 'radius',
  value() {
    if (!this.styles.borderRadius) {
      return null;
    }
    const min_length = Math.min(this.width, this.height);
    const arr = this.styles.borderRadius.map((rad: number | string) => {
      if (typeof rad === 'string' && rad.indexOf('%')) {
        return (parseInt(rad) / 100) * min_length;
      }
      return rad;
    });
    return arr.join(',');
  },
};
