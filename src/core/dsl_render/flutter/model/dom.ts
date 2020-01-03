import QLog from '../../../dsl_service_ts/helper/qlog';
import PropertyMap from '../propertyMap';
import VDom from '../../vdom';

const Loger = QLog.getInstance(QLog.moduleData.render);

class FlutterDom extends VDom {
  template: any;
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

export default FlutterDom;
