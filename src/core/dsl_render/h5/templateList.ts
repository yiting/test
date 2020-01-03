// 模块用于加载模板文件
// 1.基础组件
import Text from '../../dsl_model/models/text/tpl/h5';
import Image from '../../dsl_model/models/image/tpl/h5';
import Dividing from '../../dsl_model/models/dividing/tpl/h5';
import Layer from '../../dsl_model/models/layer/tpl/h5';
import Body from '../../dsl_model/models/body/tpl/h5';
import List from '../../dsl_model/models/list/tpl/h5';
import Inline from '../../dsl_model/widgets/inline/tpl/h5';
import ListItem from '../../dsl_model/models/listItem/tpl/h5';
// 模板数组
export default [Body, Text, Image, Dividing, Inline, Layer, List, ListItem];
