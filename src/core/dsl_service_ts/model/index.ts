import Model from './model';
import QLog from '../log/qlog';
import Dictionary from '../helper/dictionary';
import ModelList from './modellist';
import BodyMode from '../../dsl_extend/models/body/model';
const Loger = QLog.getInstance(QLog.moduleData.render);
export default function(nodes: any[]) {
  const newNodeList: Model[] = [];
  let bodyModel;
  let ModelType;

  let bodyAttr = {
    abX: Number.POSITIVE_INFINITY,
    abY: Number.POSITIVE_INFINITY,
    abYops: Number.NEGATIVE_INFINITY,
    abXops: Number.NEGATIVE_INFINITY,
    width: 0,
    height: 0,
    zIndex: Number.POSITIVE_INFINITY,
  };
  Model.resetSerialId();
  nodes.forEach((node: any) => {
    // 判断节点类型
    judgeType(node);
    if (node.type === Dictionary.type.QBody) {
      bodyModel = node;
    }
    ModelType = Model;
    // 匹配节点模型
    ModelList.some((model: any) => {
      if (model.regular(node)) {
        ModelType = model;
        return true;
      }
      return false;
    });
    let newNode = new ModelType(node);
    newNodeList.push(newNode);
    // 更新body边距
    bodyAttr.abX = newNode.abX < bodyAttr.abX ? newNode.abX : bodyAttr.abX;
    bodyAttr.abY = newNode.abY < bodyAttr.abY ? newNode.abY : bodyAttr.abY;
    bodyAttr.abYops =
      bodyAttr.abYops < newNode.abYops ? newNode.abYops : bodyAttr.abYops;
    bodyAttr.abXops =
      bodyAttr.abXops < newNode.abXops ? newNode.abXops : bodyAttr.abXops;
    bodyAttr.zIndex =
      bodyAttr.zIndex > newNode.zIndex ? newNode.zIndex : bodyAttr.zIndex;
  });
  // 如果没有body，自动生成body
  if (!bodyModel) {
    newNodeList.push(new BodyMode(bodyAttr));
  }

  return newNodeList;
}

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
      node.type = Dictionary.type.QBody;
      break;
    default:
      Loger.warn(
        `model/index [judege] nodes分类遇到没有对应类型的节,id:${node.id}`,
      );
  }
  return node;
}
