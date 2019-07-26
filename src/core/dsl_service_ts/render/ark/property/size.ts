export default {
  key: 'size',
  value() {
    return `${this.abXops - this.abX},${this.abYops - this.abY}`;
  },
};
