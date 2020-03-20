// 模块用于加载模板文件
// 1.基础组件
import Text from './models/text/tpl';
import Image from './models/image/tpl';
import Dividing from './models/dividing/tpl';
import Layer from './models/layer/tpl';
import Body from './models/body/tpl';
import List from './models/list/tpl';
import ListItem from './models/listItem/tpl';
import Inline from './widgets/inline/tpl';
import Button from './widgets/button/tpl';
// 模板数组
export default [
  Layer,
  Body,
  Text,
  Image,
  Dividing,
  Inline,
  List,
  ListItem,
  Button,
];
