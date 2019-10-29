// 模块用于对模型进行布局及结构分析, 生成可用于渲染的数据
import LayoutSimilar from './layouts/similar';
import LayoutCircle from './layouts/circle';
import LayoutSort from './layouts/sort';
import LayoutBaseLine from './layouts/baseline';
import QLog from '../log/qlog';
import LayoutEquality from './layouts/equality';
import Dictionary from '../helper/dictionary';

const Loger = QLog.getInstance(QLog.moduleData.render);

const walkIn = function(layoutObject: any, dslTree: any) {
  const { children } = dslTree;
  if (children.length <= 0 || dslTree.type === Dictionary.type.QText) {
    return;
  }
  layoutObject.handle(dslTree, children);
  dslTree.children.forEach((child: any) => {
    walkIn(layoutObject, child);
  });
};

const walkOut = function(layoutObject: any, dslTree: any) {
  const { children } = dslTree;
  if (children.length <= 0 || dslTree.type === Dictionary.type.QText) {
    return;
  }
  children.forEach((child: any) => {
    walkOut(layoutObject, child);
  });
  layoutObject.handle(dslTree, children);
};

export default function(dslTree: any) {
  let _logStep = 'start';
  try {
    // 排序
    _logStep = '排序';
    walkIn(LayoutSort, dslTree);
    // 等分
    _logStep = '等分';
    walkIn(LayoutEquality, dslTree);
    // 布局
    _logStep = '布局';
    walkIn(LayoutBaseLine, dslTree);
    // 相似
    _logStep = '相似';
    LayoutSimilar.handle(dslTree);
    // 循环
    _logStep = '循环';
    walkOut(LayoutCircle, dslTree);
    // 排序
    // _logStep = '排序';
    // walkIn(LayoutSort, dslTree);
  } catch (e) {
    Loger.error(`dsl/layout/index.ts layout()
      desc: ${_logStep}
      error:${e}`);
  }
}
