// 模块用于加载模板文件
// 1.基础组件
import tText from './models/text/tpl';
import tImage from './models/image/tpl';
import tDividing from './models/dividing/tpl';
import tLayer from './models/layer/tpl';
import tBody from './models/body/tpl';
import tList from './models/list/tpl';
import tListItem from './models/listItem/tpl';
import tInline from './unions/inline/tpl';
import tButton from './widgets/button/tpl';

import mDividing from './models/dividing/model';
import mImage from '../../dsl_model/models/image';
import mLayer from '../../dsl_model/models/layer';
import mText from '../../dsl_model/models/text';
import mBody from '../../dsl_model/models/body';
import mList from './models/list/model';
import mListItem from './models/listItem/model';

import uInline from './unions/inline/union';
import wButton from './widgets/button/widget';

// 模板数组
export default {
  templateList: [
    tLayer,
    tBody,
    tText,
    tImage,
    tDividing,
    tInline,
    tList,
    tListItem,
    tButton,
  ],
  modelList: [mDividing, mImage, mLayer, mText, mBody, mList, mListItem],
  unionList: [uInline],
  widgetList: [wButton],
};
