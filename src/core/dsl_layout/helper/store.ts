let DSLOptions: any = process.env._DSLOptions
  ? JSON.parse(process.env._DSLOptions)
  : {};

export default {
  get(key: string) {
    return DSLOptions[key];
  },
  set(key: string, value: any) {
    DSLOptions[key] = value;
    process.env._DSLOptions = JSON.stringify(DSLOptions);
  },
  assign(obj: any) {
    DSLOptions = obj;
    process.env._DSLOptions = JSON.stringify(DSLOptions);
  },
  getAll() {
    return DSLOptions;
  },
};
