class Resource {
  nodes: any[];
  constructor(node: any) {
    this.nodes = Resource.serializate(node);
  }
  static serializate(node: any, arr: any[] = []) {
    arr.push(node);
    node.children.forEach((nd: any) => Resource.serializate(nd, arr));
    return arr;
  }
  static fontName(text: any) {
    return 'app.' + text.font + text.size;
  }
  getFontString() {
    const fontMap: any = {};
    this.nodes.forEach((nd: any) => {
      if (nd.styles.texts) {
        nd.styles.texts.forEach((text: any) => {
          const name = Resource.fontName(text);
          if (!fontMap[name]) {
            fontMap[name] = {
              family: text.font,
              size: text.size,
            };
          }
        });
      }
    });
    const list = Object.keys(fontMap).map((id: any) => {
      const obj = fontMap[id];
      return `<Font id="${id}" size="${obj.size}" family="${obj.family}" />`;
    });
    return '<Resource>' + list.join('') + '</Resource>';
  }
}

export default Resource;
