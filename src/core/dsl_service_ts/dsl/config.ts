// 此模块用于生成dsl返回的一些根据配置参数和实际数据生成的一些参数
//
import Common from './common';

export default {
  create() {
    let width = 0; // 设计稿宽
    const height = 0; // 设计稿高
    let unit; // 换算单位
    let dpr; // 设备像素比

    switch (`${Common.DesignWidth}`) {
      case '1080': {
        // 基于安卓设计
        width = 1080;
        unit = 'rem';
        dpr = 2;
        break;
      }
      case '750': {
        width = 750;
        unit = 'rem';
        dpr = 2;
        break;
      }
      case '720': {
        width = 720;
        unit = 'rem';
        dpr = 2;
        break;
      }
      case '375': {
        width = 375;
        unit = 'rem';
        dpr = 1;
        break;
      }
      case '360': {
        width = 360;
        unit = 'rem';
        dpr = 1;
        break;
      }
      default: {
        unit = 'px';
        dpr = 1;
      }
    }

    return {
      width,
      height,
      unit,
      dpr,
    };
  },
};
