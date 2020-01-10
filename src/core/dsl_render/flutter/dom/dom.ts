import PropertyMap from './propertyMap';
import VDom from '../../vdom';

export default class FlutterDom extends VDom {
  constructor(node: any, parent: any) {
    super(node, parent);
    // 根据映射定义属性
    PropertyMap.forEach((prop: any) => {
      Object.defineProperty(this, prop.key, {
        get: prop.value,
      });
    });
  }
}
