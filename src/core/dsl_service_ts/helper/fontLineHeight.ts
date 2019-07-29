const FamilyMap: any = {
  Arial: 1.1171875,
  YaHei: 1.32,
  PingFangSC: 1.4,
};
function FontLineHeight(family: string, size: number) {
  let rate = 1.4;
  Object.keys(FamilyMap).some((key: string) => {
    if (family.indexOf(key) > -1) {
      rate = FamilyMap[key];
      return true;
    }
  });
  return Math.round(rate * size);
}

export default FontLineHeight;
