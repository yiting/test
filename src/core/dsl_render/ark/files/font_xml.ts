export default (fontMap: any) => {
  const list = Object.keys(fontMap).map((name: string) => {
    const font = fontMap[name];
    return `<Font id="${name}" size="${font.size}" family="${font.name}" />`;
  });

  return `<Resource>${list.join('')}</Resource>`;
};
