/** 行高清洗  */

export default function(nodes: any) {
  const arr: any = [];
  nodes.forEach((node: any) => {
    const res: any = pipe(node);
    arr.push(res);
  });
  return arr;
}
function pipe(node: any) {
  // if (node.id == '87112A6C-35BF-4F03-8CB9-B8A144621673') debugger
  let maxLineHeight;
  let maxFontSize;
  if (!node.styles.texts) {
    return node;
  }
  const lineHeights: any = [];
  const fontSizes: any = [];
  node.styles.texts.forEach((text: any) => {
    lineHeights.push(text.lineHeight || text.size * 1.2);
    fontSizes.push(text.size);
  });
  maxLineHeight = Math.max(...lineHeights);
  maxFontSize = Math.max(...fontSizes);
  // 如果文本高度矮过字体大小，高度恢复为行高高度
  if (node.height <= maxFontSize) {
    //
    const dur = Math.floor((maxLineHeight - node.height) / 2);
    node.abY -= dur;
    node.abYops += dur;
    node.styles.lineHeight = maxLineHeight;
  }
  return node;
}
