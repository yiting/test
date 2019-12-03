/**
 * 换行清洗 */

import Canvas from 'canvas';
import TextModel from '../../dsl_extend/models/text/model';
const Context = Canvas.createCanvas(200, 200).getContext('2d');

const regWrap = /.*\n+/m;
const regRes = /\n+|[^\n]+/gim;

function newJson(node: any) {
  return JSON.parse(JSON.stringify(node));
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
  // 如果包含换行符，拆分节点
  if (node.text && regWrap.test(node.text)) {
    const paragraphList: any = [];
    let rowIndex = 0;
    // 当前行
    let curRow: any = {
      rowIndex,
      texts: [],
    };
    // 行列表
    let rowList = [curRow];
    // 遍历文本节点，找到换行节点
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
    // 高度计算
    let increaseTop = 0;
    rowList.forEach((row: any, i: number) => {
      let curNode: any = null;
      const sizes = row.texts.map((text: any) => text.lineHeight);
      const rowLineHeight = Math.max(...sizes);
      if (row.texts.length == 1 && !row.texts[0].string) {
        // 空行
        /* curNode = copy(node);
        curNode.id = curNode.id + '_row' + i;
        curNode.styles.texts = []; */
        curNode = null;
      } else {
        // if (!paragraphList.includes(curNode)) {
        curNode = new TextModel(newJson(node));
        curNode.id = curNode.id + '_row' + i;
        curNode.styles.lineHeight = rowLineHeight;
        curNode.styles.texts = [];
        curNode.abY += increaseTop;
        curNode.styles.texts.push(...row.texts.filter((n: any) => !!n.string));
        const rows = calRows(curNode.styles.texts, node.width);
        curNode.abYops = curNode.abY + rowLineHeight * rows;

        paragraphList.push(curNode);
      }
      increaseTop += curNode ? curNode.height : rowLineHeight;
    });
    return paragraphList;
  }
  return [node];
}

function calRows(texts: any, maxWidth: number) {
  let lineWidth = 0;
  let rows = 1;
  texts.forEach((charObj: any) => {
    const string = charObj.string;
    const font = `${charObj.size}px ${charObj.font}`;
    Context.font = font;
    string.split('').forEach((char: string, i: number) => {
      lineWidth += Context.measureText(char).width;
      if (lineWidth > maxWidth) {
        rows += 1;
        lineWidth = 0;
      }
    });
  });
  return rows;
}
