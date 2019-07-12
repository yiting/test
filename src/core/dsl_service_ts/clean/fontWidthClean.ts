import Canvas from 'canvas';
const Context = Canvas.createCanvas(200, 200).getContext('2d');

export default (node: any) => {
  // 计算文本宽度
  if (node.styles.texts) {
    let textWidth = 0;
    Context.clearRect(0, 0, 200, 200);
    node.styles.texts.forEach((text: any) => {
      Context.save();
      Context.font = `${text.size}px ${text.font}`;
      textWidth += Context.measureText(text.string).width;
    });
    textWidth = Math.ceil(textWidth);
    if (textWidth && textWidth < node.width) {
      node.width = textWidth;
      if (node.styles.textAlign == 1) {
        // 中对齐
        node.abX = Math.ceil(node.abX + node.width / 2 - textWidth / 2);
      } else if (node.styles.textAlign == 2) {
        // 右对齐
        node.abX = Math.ceil(node.abX + node.width - textWidth);
      } else {
        // 左对齐
      }
    }
  }
};
