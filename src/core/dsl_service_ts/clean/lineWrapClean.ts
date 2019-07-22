const regWrap = /.*\n{2,}/m;
const regRes = /\n+|[^\n]+/gim;

export default function(nodes: any) {
  const arr: any = [];
  nodes.forEach((node: any) => {
    const res: any = pipe(node);
    arr.push(...res);
  });
  return arr;
}
function pipe(node: any) {
  // 如果包含连续换行符
  if (node.text && regWrap.test(node.text)) {
    const list = [];
    let rowIndex = 0,
      curNode: any = {
        rowIndex,
        texts: [],
      },
      newNodes = [curNode];
    node.styles.texts.forEach((txt: any) => {
      const res = txt.string.match(regRes);
      let curText = Object.assign({}, txt, {
        string: '',
      });
      curNode.texts.push(curText);
      res.forEach((str: string) => {
        if (str[0] === '\n') {
          rowIndex += str.length;
          if (str.length > 1) {
            // 如果大于1个，分段
            curText = Object.assign({}, txt, {
              string: '',
            });
            curNode = {
              rowIndex,
              texts: [curText],
            };
            newNodes.push(curNode);
            return;
          }
        }
        curText.string += str;
      });
    });
    newNodes.forEach((textNode: any) => {
      const newNode = Object.assign({}, node);
      let lineHeight = newNode.styles.lineHeight;
      if (!lineHeight) {
        lineHeight = Math.max(...textNode.forEach((text: any) => text.size));
      }
      newNode.styles.texts = textNode.texts;
      newNode.abY = textNode;
    });
  }
}
