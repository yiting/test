let domCssMap: any = {};
let classNameMap: any = {};
let simClassNameMap: any = {};

function getClassNameMap(dom: any) {
  let classNameChain = dom.classNameChain.map((n: any) => `.${n}`).join(' ');
  let simClassNameChain = dom.simClassNameChain
    .map((n: any) => `.${n}`)
    .join(' ');
  if (classNameChain) {
    if (!classNameMap[classNameChain]) {
      classNameMap[classNameChain] = [];
    }
    classNameMap[classNameChain].push(dom);
  }
  if (simClassNameChain) {
    if (!classNameMap[simClassNameChain]) {
      classNameMap[simClassNameChain] = [];
    }
    classNameMap[simClassNameChain].push(dom);
  }
  if (dom.children) {
    dom.children.forEach(getClassNameMap);
  }
}
export default function(cssTree: any, simDoms: any) {
  getClassNameMap(cssTree);
  Object.keys(classNameMap).forEach((classNameChain: string) => {});
}
