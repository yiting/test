// 模块用于加载模板文件
// 1.基础组件
import Text from './base/text';
import Image from './base/image';
import Dividing from './base/dividing';
import Inline from './base/inline';
import Layer from './base/layer';
import Body from './base/body';
import List from '../../../dsl_extend/models/list/tpl/h5';
import ListItem from '../../../dsl_extend/models/listItem/tpl/h5';
// 模板数组
export default [Body, Text, Image, Dividing, Inline, Layer, List, ListItem];
