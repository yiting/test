export default function(node: any) {
  if (node.text && node.text[node.text.length - 1] == '\n') {
    node.text = node.text.slice(0, -1);
    node.height = node.height - node.styles.lineHeight;
    const lastTextIndex = node.styles.texts.length - 1;
    node.styles.texts[lastTextIndex].string = node.styles.texts[
      lastTextIndex
    ].slice(0, -1);
  }
}
