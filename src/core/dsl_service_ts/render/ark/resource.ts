class Resource {
  constructor() {}
  static serializate(node: any, arr: any[] = []) {
    arr.push(node);
    node.children.forEach((nd: any) => Resource.serializate(nd, arr));
    return arr;
  }
  static fontName(text: any) {
    return 'app.' + text.font + text.size;
  }
  static getFontMap(nodes: any[]) {
    const fontMap: any = {};
    nodes.forEach((nd: any) => {
      if (nd.styles.texts) {
        nd.styles.texts.forEach((text: any) => {
          const name = Resource.fontName(text);
          if (!fontMap[name]) {
            fontMap[name] = {
              name,
              family: text.font,
              size: text.size,
            };
          }
        });
      }
    });
    return fontMap;
  }
  static getImageList(nodes: any[]) {
    const resList: any = [];
    nodes.forEach((nd: any) => {
      if (nd.path && !resList.includes(nd.path)) {
        resList.push('res/' + nd.path);
      }
    });
    return resList;
  }
  static formatPath(config: string[]) {
    const paths: string[] = [];
    config.forEach((path: string) => {
      if (path.indexOf('/src/') > -1) {
        paths.push(path.replace(/^\/src\//i, ''));
      }
    });
    return paths;
  }
  static process(node: any) {
    const nodes = Resource.serializate(node);
    const fontMap = Resource.getFontMap(nodes);
    const imageList = Resource.getImageList(nodes);
    return {
      nodes,
      fontMap,
      imageList,
    };
  }
}

export default Resource;
