/**
 * 处理AI数据结构
 * @param {*} AIData
 */
let AIServiceUrl = "http://10.65.90.45:8080";
let AIDataHandle = function(AIData) {
  let arr = [];
  try {
    AIData = AIData.trim().split(/\s/);
    let n = 0;
    for (let i in AIData) {
      let AIOne = AIData[i];
      let AIOneArr = AIOne.split(";");
      let AIOneArrFirst = AIOneArr[0].split(":");
      let AIOneArrSec = AIOneArr[1].split(":");
      let AIOneArrThird = AIOneArr[2].split(":");
      let AIOneArrFourth = AIOneArr[3].split(":");
      let AIOneArrFifth = AIOneArr[4].split(":");
      //第一个元素
      let o = {
        id: "ai-" + n++,
        name: AIOneArrFirst[0],
        rate: AIOneArrFirst[1],
        width: AIOneArrSec[1],
        height: AIOneArrThird[1],
        x: AIOneArrFourth[1],
        y: AIOneArrFifth[1]
      };
      arr.push(o);
    }
    console.log(arr);
  } catch (e) {
    //未匹配到模型结果
    arr = ["none"];
  }
  return arr;
};

module.exports = {
  AIServiceUrl,
  AIDataHandle
};
