import Model from './model';
import QLog from '../log/qlog';
import Dictionary from '../helper/dictionary';
import ModelList from './modellist';
const Loger = QLog.getInstance(QLog.moduleData.render);
export default function(nodes: any[]) {
  const newNodes: Model[] = [];
  let ModelType;
  Model.resetSerialId();
  nodes.forEach((node: any) => {
    ModelType = Model;
    ModelList.some((model: any) => {
      if (model.regular(node)) {
        ModelType = model;
        return true;
      }
      return false;
    });
    newNodes.push(new ModelType(node));
  });
  return newNodes;
}
/*
function judgeType(node: any) {
  switch (node.type) {
    case 'QShape':
      node.type = Dictionary.type.QImage;
      break;
    case 'QImage':
      node.type = Dictionary.type.QImage;
      break;
    case 'QText':
      node.type = Dictionary.type.QText;
      break;
    case 'QLayer':
      node.type = Dictionary.type.QLayer;
      break;
    case 'QBody':
      node.type = Dictionary.type.QLayer;
      break;
    default:
      Loger.warn(
        `model/index [judege] nodes分类遇到没有对应类型的节,id:${node.id}`,
      );
  }
  return node;
}
 */
