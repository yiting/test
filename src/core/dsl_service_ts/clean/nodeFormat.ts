export default function(nodes: any) {
  nodes.forEach(pipe);
  return nodes;
}

function pipe(node: any) {
  if (node.styles.texts) {
    node.styles.texts.forEach((text: any) => {
      text.font = text.font || '';
    });
  }
}
