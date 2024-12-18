import CssBoundary from './boundary';
import CssConstraints from './supplementConstraints';

function _func(domTree: any) {
  CssBoundary(domTree);
  CssConstraints(domTree);
  if (domTree.children) {
    domTree.children.forEach((child: any) => {
      _func(child);
    });
  }
}
export default _func;
