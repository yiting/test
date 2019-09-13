/** 行高清洗  */

import FontLineHeight from '../helper/fontLineHeight';

export default function(nodes: any) {
  const arr: any = [];
  nodes.forEach((node: any) => {
    const res: any = pipe(node);
    arr.push(res);
  });
  return arr;
}
function pipe(node: any) {
  let lineHeight = node.styles.lineHeight;
  let fontSize;
  if (!node.styles.texts) {
    return node;
  }
  if (node.styles.texts) {
    const lineHeights: any = [];
    const fontSizes: any = [];
    node.styles.texts.forEach((text: any) => {
      const h = FontLineHeight(text.font, text.size);
      lineHeights.push(h);
      fontSizes.push(text.size);
    });
    lineHeight = Math.max(...lineHeights);
    fontSize = Math.max(fontSizes);
  }
  if (!node.styles.lineHeight) {
    // 如果没默认行高，修改默认行高
    node.styles.lineHeight = lineHeight;
  }
  if (node.height <= fontSize) {
    //
    const dur = Math.floor((lineHeight - node.height) / 2);
    node.abY -= dur;
    node.abYops += dur;
    node.styles.lineHeight = lineHeight;
    node.height = lineHeight;
  }
  return node;
}
