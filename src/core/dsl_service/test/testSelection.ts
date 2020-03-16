import designjson from './game.json';

import Dsl from '../dslService';

// 测试获取节点范围
let nodes: any = [];
designjson.forEach((item: any) => {
  // 测试选取范围
  let startX = 0;
  let startY = 1750;
  let endX = 750;
  let endY = 1920; //2310

  if (
    item.abX >= startX &&
    item.abX + item.width <= endX &&
    item.abY >= startY &&
    item.abY + item.height <= endY
  ) {
    // 测试获取的节点
    nodes.push(item);
  }
});

let input: any = {};
input.nodes = nodes;

// 测试部分生成接口
//Dsl.processSelectionV2(input, {});
let render: any = Dsl.process(input, {});
console.log(render.uiString);
