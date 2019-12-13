import Model from './model';
import QLog from '../log/qlog';
import Dictionary from '../helper/dictionary';
import ModelList from './modellist';
import BodyMode from '../../dsl_extend/models/body/model';
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

    // 判断节点类型
    if (newNode.type === Dictionary.type.QBody) {
      bodyModel = newNode;
    }
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
