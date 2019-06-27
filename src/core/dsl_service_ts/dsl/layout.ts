// 模块用于对模型进行布局及结构分析, 生成可用于渲染的数据
import LayoutSimilar from './layouts/layout_similar';
import LayoutCircle from './layouts/layout_circle';
// import LayoutSort from './layouts/layout_sort';
// import LayoutAbsolute from './layouts/layout_absolute';
import LayoutFlex from './layouts/layout_flex';
import LayoutBaseLine from './layouts/layout_baseline';
import QLog from '../log/qlog';
import LayoutEquality from './layouts/layout_equality';

const Loger = QLog.getInstance(QLog.moduleData.render);

const walkIn = function(layoutObject: any, dslTree: any) {
  const { children } = dslTree;
  if (children.length <= 0) {
    return;
  }
  layoutObject.handle(dslTree, children);
  dslTree.children.forEach((child: any) => {
    walkIn(layoutObject, child);
  });
};

const walkOut = function(layoutObject: any, dslTree: any) {
  const { children } = dslTree;
  if (children.length <= 0) {
    return;
  }
  children.forEach((child: any) => {
    walkOut(layoutObject, child);
  });
  layoutObject.handle(dslTree, children);
};

function layout(dslTree: any) {
  let _logStep = 'start';
  try {
    // 等分
    _logStep = '等分';
    walkIn(LayoutEquality, dslTree._treeData);
    // 布局
    _logStep = '布局';
    walkIn(LayoutBaseLine, dslTree._treeData);
    // 相似
    _logStep = '相似';
    LayoutSimilar.handle(dslTree._treeData);
    // 循环
    _logStep = '循环';
    walkOut(LayoutCircle, dslTree._treeData);
    // 排序
    // _logStep = '排序';
    // walkIn(LayoutSort, dslTree._treeData);
  } catch (e) {
    Loger.error(`dsl/layout.ts layout()
      desc: ${_logStep}
      error:${e}`);
  }
}

export default {
  layout,
};
