// 此模块用于定义一些在dsl模块包中用到的一些常量
//
export default {
  // 一些特定尺寸
  DesignWidth: 750, // 默认750的设计稿宽
  DesignHeight: -1, // 默认auto的设计稿高
  IconSize: 80, // 默认Icon的大小

  // 模型匹配的优先级
  LvSS: 5,
  LvS: 4,
  LvA: 3,
  LvB: 2,
  LvC: 1,
  LvD: 0,

  // 模型的类型
  QText: 'QText',
  QIcon: 'QIcon',
  QImage: 'QImage',
  QShape: 'QShape',
  QWidget: 'QWidget',
  QLayer: 'QLayer', // 包含层
  QBody: 'QBody', // 跟节点

  // 函数状态选择
  MatchingElements: 0,
  MatchingWidgets: 1,
  MatchingBase: 2,
  MatchingElementX: 3,

  // 匹配后的结构化储存类
  ElementData: 0,
  WidgetData: 1,

  // 布局类型
  AbsoluteLayout: 1,
  FlexLayout: 2,
  FixedLayout: 3,
  TestLayout: 4,
};
