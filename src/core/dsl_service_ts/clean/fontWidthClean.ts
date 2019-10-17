/**字宽清洗 */

import Canvas from 'canvas';
// import measureText from 'measure-text';
const Context = Canvas.createCanvas(200, 200).getContext('2d');

export default (nodes: any) => {
  // 计算文本宽度
  nodes.forEach(pipe);
  return nodes;
};

function pipe(node: any) {
  if (node.styles.texts) {
    let textWidth = 0;
    Context.clearRect(0, 0, 200, 200);
    node.styles.texts.forEach((text: any) => {
      Context.save();
      Context.font = `${text.size}px ${text.font}`;
      textWidth += Math.round(Context.measureText(text.string).width);
      // for (let i = 0; i < text.string.length; i++) {
      //   console.log(Context.measureText(text.string[i]).width)
      //   textWidth += Math.round(Context.measureText(text.string[i]).width);
      // }
      Context.restore();
    });
    if (textWidth && textWidth < node.width) {
      // 0 左 1 右 2 中 3 两端
      if (node.styles.textAlign == 2) {
        // 中对齐
        node.abX = Math.ceil(node.abX + node.width / 2 - textWidth / 2);
        node.abXops = node.abX + textWidth;
      } else if (node.styles.textAlign == 1) {
        // 右对齐
        node.abX = Math.ceil(node.abX + node.width - textWidth);
        node.abXops = node.abX + textWidth;
      } else {
        // 左对齐
      }
    }
  }
}
