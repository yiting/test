// 布局类
import display from './css/display';
import flexDirection from './css/flexDirection';
import flexWrap from './css/flexWrap';
import alignItems from './css/alignItems';
import justifyContent from './css/justifyContent';
import flex from './css/flex';
import width from './css/width';
import height from './css/height';
import marginTop from './css/marginTop';
import marginRight from './css/marginRight';
import marginBottom from './css/marginBottom';
import marginLeft from './css/marginLeft';
import paddingLeft from './css/paddingLeft';
import paddingRight from './css/paddingRight';
import paddingTop from './css/paddingTop';
import paddingBottom from './css/paddingBottom';
import padding from './css/padding';
import top from './css/top';
import right from './css/right';
import bottom from './css/bottom';
import left from './css/left';
// // 属性类
import zIndex from './css/zIndex';
import backgroundImage from './css/backgroundImage';
import backgroundColor from './css/backgroundColor';
import backgroundSize from './css/backgroundSize';
import backgroundRepeat from './css/backgroundRepeat';
import color from './css/color';
import fontFamily from './css/fontFamily';
import fontSize from './css/fontSize';
import position from './css/position';
import filter from './css/filter';
import border from './css/border';
import boxSizing from './css/boxSizing';
import borderRadius from './css/borderRadius';
import overflow from './css/overflow';
import textOverflow from './css/textOverflow';
import textAlign from './css/textAlign';
import whiteSpace from './css/whiteSpace';
import verticalAlign from './css/verticalAlign';
import lineHeight from './css/lineHeight';
import opacity from './css/opacity';
import margin from './css/margin';

export let map: any = [
  // 布局
  display,
  flexDirection,
  alignItems,
  justifyContent,
  flexWrap,
  flex,
  // 边距
  // marginTop,
  // marginRight,
  // marginBottom,
  // marginLeft,
  // paddingTop,
  // paddingBottom,
  // paddingLeft,
  // paddingRight,
  padding,
  margin,
  // 高宽
  width,
  height,
  // 位置
  top,
  right,
  bottom,
  left,
  position,
  zIndex,
  verticalAlign,
  // 背景
  backgroundImage,
  backgroundColor,
  backgroundSize,
  backgroundRepeat,
  // 属性类
  color,
  fontFamily,
  fontSize,
  textOverflow,
  textAlign,
  whiteSpace,
  lineHeight,
  // 效果
  filter,
  border,
  borderRadius,
  boxSizing,
  overflow,
  opacity,
];
export let defaultProperty: any = {
  display: 'block',
  alignItems: 'flex-start',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  flex: '0 1 auto',
  width: 'auto',
  height: 'auto',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
  margin: '0',
  paddingLeft: '0',
  paddingRight: '0',
  paddingTop: '0',
  paddingBottom: '0',
  padding: '0',
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  zIndex: 'auto',
  backgroundImage: 'none',
  backgroundColor: 'rgba(0,0,0,0)',
  backgroundSize: 'auto',
  backgroundRepeat: 'repeat',
  color: 'rgba(0,0,0,1)',
  fontFamily: 'auto',
  fontSize: 0,
  position: 'static',
  filter: 'none',
  border: 'none',
  boxSizing: 'content-box',
  borderRadius: '0',
  overflow: 'visible',
  textOverflow: 'clip',
  textAlign: 'left',
  whiteSpace: 'normal',
  verticalAlign: 'baseline',
  lineHeight: 'normal',
  opacity: '1',
};
export let inheritProperty: any = [
  'color',
  'fontFamily',
  'fontSize',
  'textAlign',
  'lineHeight',
];
