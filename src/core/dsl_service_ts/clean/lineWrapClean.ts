const regWrap = /.*\n{2,}/m;
const regRes = /\n+|[^\n]+/gim;

import FontLineHeight from '../helper/fontLineHeight';

function copy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

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
    const paragraphList: any = [];
    let rowIndex = 0,
      // 当前行
      curRow: any = {
        rowIndex,
        texts: [],
      },
      // 行列表
      rowList = [curRow];
    node.styles.texts.forEach((txt: any) => {
      const res = txt.string.match(regRes);
      let curText = Object.assign({}, txt, {
        string: '',
      });
      curRow.texts.push(curText);
      res.forEach((str: string) => {
        if (str[0] === '\n') {
          // 如果当前文本是换行符
          for (let l = 0; l < str.length; l++) {
            rowIndex += 1;
            // 如果大于1个，分段
            curText = Object.assign({}, txt, {
              string: '',
            });
            curRow = {
              rowIndex,
              texts: [curText],
            };
            rowList.push(curRow);
          }
          str = '';
        }
        curText.string += str;
      });
    });
    let increaseTop = 0;
    let curNode: any = null;
    rowList.forEach((row: any, i: number) => {
      let lineHeight = node.styles.lineHeight;
      if (!lineHeight) {
        const sizes = row.texts.map((text: any) =>
          FontLineHeight(text.font, text.size),
        );
        lineHeight = Math.max(...sizes);
      }
      if (row.texts.length == 1 && !row.texts[0].string) {
        // 空行
        /* curNode = copy(node);
        curNode.id = curNode.id + '_row' + i;
        curNode.styles.texts = []; */
        curNode = null;
      } else {
        // if (!paragraphList.includes(curNode)) {
        curNode = copy(node);
        curNode.id = curNode.id + '_row' + i;
        curNode.styles.lineHeight = lineHeight;
        curNode.styles.texts = [];
        curNode.abY += increaseTop;
        curNode.height = 0;
        paragraphList.push(curNode);
        curNode.styles.texts.push(...row.texts.filter((n: any) => !!n.string));
        curNode.height += lineHeight;
      }
      increaseTop += lineHeight;
    });
    return paragraphList;
  }
  return [node];
}
