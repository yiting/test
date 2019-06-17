// 此模块为模型识别的模块工具函数
//
import Common from './common';

const utils = {
  /**
   * 从传入的nodes中,根据beginX, beginY, optimizeWidth, optimizeHeight参数
   * 获取对应范围的的node节点
   * @param {Array} nodes 需要分范围获取的节点
   * @param {Int} beginX 范围开始的x坐标
   * @param {Int} beginY 范围开始的y坐标
   * @param {Int} optimizeWidth 范围的宽度
   * @param {Int} optimizeHeight 范围的高度
   * @return {Array}
   */
  getNodesFromSize(
    nodes: any[],
    beginX: number,
    beginY: number,
    optimizeWidth: number,
    optimizeHeight: number,
  ): any[] {
    let result: any = [];
    nodes.forEach((item: any) => {
      if (
        item.abX >= beginX &&
        item.abX < beginX + optimizeWidth &&
        item.abY >= beginY &&
        item.abY < beginY + optimizeHeight
      ) {
        result.push(item);
      }
    });

    return result;
  },

  /**
   * 将模型按优先级进行排序, 优先级相同则按数量优先
   * @param {Array} list <BaseModel> 模型列表
   */
  sortModelList: function(list: any[]) {
    let arr: any[] = [];
    const len = list.length;
    list.forEach((item: any) => {
      arr.push(item);
    });

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (arr[j].priority < arr[j + 1].priority) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        } else if (arr[j].priority == arr[j + 1].priority) {
          if (arr[j].getNumber() < arr[j + 1].getNumber()) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }

    return arr;
  },

  /**
   * 随机排列节点的算法函数
   * @param {Array} nodes 需要组合的节点
   * @param {Int} textNum 组合里的QText元素数量
   * @param {Int} iconNum 组合里的QIcon元素数量
   * @param {Int} imageNum 组合里的QImage元素数量
   * @param {Int} shapeNum 组合里的QShape元素数量
   */
  getGroupFromNodes(
    nodes: any,
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
  ) {
    if (!nodes || !nodes.length || nodes.length === 0) {
      return null;
    }
    // 为了减少计算量, 这里不需做完全随机, 这里分两步优化, 输进来的nodes节点已根据尺寸分步输入, 减少节点两
    // 通过textNum, iconNum, imageNum, shapeNum的数量来做随机
    const typeNum = 4;
    let result: any = [];
    let resultTemp: any = [];

    // 筛选出用于匹配的各类型节点
    let textNodes: any = [];
    let iconNodes: any = [];
    let imageNodes: any = [];
    let shapeNodes: any = [];

    nodes.forEach((item: any) => {
      switch (item.type) {
        case Common.QText:
          textNodes.push(item);
          break;
        case Common.QIcon:
          iconNodes.push(item);
          break;
        case Common.QImage:
          imageNodes.push(item);
          break;
        case Common.QShape:
          shapeNodes.push(item);
          break;
        default:
          break;
      }
    });

    // 根据每类元素需要的个数获取所有可以排列的组合,然后再对这四类进行排列
    let typeRandom = [];
    typeRandom[0] = this.getRandomGroup(textNodes, textNum);
    typeRandom[1] = this.getRandomGroup(iconNodes, iconNum);
    typeRandom[2] = this.getRandomGroup(imageNodes, imageNum);
    typeRandom[3] = this.getRandomGroup(shapeNodes, shapeNum);

    let allGroups = [];
    for (let i = 0; i < typeNum; i++) {
      if (typeRandom[i] && typeRandom[i].length > 0) {
        allGroups.push(typeRandom[i]);
      }
    }

    // 进行不重复排列组合
    this.joinGroup(allGroups, 0, resultTemp, result);
    // 转为一维数组组合
    result = this.transformToLinearArray(result);
    // 将组合里面不符合textNum,iconNum,imageNum,shapeNum的组合去掉
    result = this.removeErrorGroup(
      result,
      textNum,
      iconNum,
      imageNum,
      shapeNum,
    );

    return result;
  },

  /**
   * 从arr数组中取出n个不重复元素的所有组合
   * @param {Array} 需要随机的数组
   * @param {Int} 组合里元素的个数
   * @return {Array}
   */
  getRandomGroup(arr: any, n: number): any[] {
    if (!arr || arr.length === 0 || n <= 0 || n > arr.length) {
      return [];
    }

    let temp: any[] = [];
    let res: any[] = [];
    this.randomGroup(arr, n, 0, temp, 0, res);

    return res;
  },

  // 递归排列函数
  randomGroup(
    arr: any[],
    n: number,
    begin: number,
    temp: any[],
    index: number,
    result: any[],
  ) {
    if (n === 0) {
      // 如果够n个数了
      const len: number = result.length;
      result[len] = [];

      temp.forEach(item => {
        result[len].push(item);
      });

      return;
    }

    for (let i = begin; i < arr.length; i++) {
      temp[index] = arr[i];
      this.randomGroup(arr, n - 1, i + 1, temp, index + 1, result);
    }
  },

  // 组合函数
  joinGroup(arr: any[], index: number, result_temp: any[], result: any[]) {
    if (!arr || arr.length === 0 || index < 0) {
      return;
    }

    if (index == arr.length) {
      let tmp: any[] = [];
      result_temp.forEach(item => {
        tmp.push(item);
      });
      result.push(tmp);

      return;
    }

    let group: any[] = arr[index];
    // 遍历元素进行组合
    for (let i = 0; i < group.length; i++) {
      let items = group[i];
      result_temp[index] = items;
      // 进入下一个流程
      this.joinGroup(arr, index + 1, result_temp, result);
    }
  },

  // 将二维数组转为一维
  transformToLinearArray(arr: any[]) {
    let res: any[] = [];
    arr.forEach((groups, index) => {
      res[index] = [];

      groups.forEach((items: any[]) => {
        items.forEach((item: any) => {
          res[index].push(item);
        });
      });
    });

    return res;
  },

  // 将数组中, 删除不符合textNum + iconNum + imageNum + shapeNum 的组合
  removeErrorGroup(
    arr: any[],
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
  ) {
    let res: any[] = [];
    if (!arr || arr.length === 0) {
      return res;
    }

    arr.forEach((item: any) => {
      let txt: number = 0;
      let icon: number = 0;
      let image: number = 0;
      let shape: number = 0;

      item.forEach((obj: any) => {
        switch (obj.type) {
          case Common.QText:
            txt += 1;
            break;
          case Common.QIcon:
            icon += 1;
            break;
          case Common.QImage:
            image += 1;
            break;
          case Common.QShape:
            shape += 1;
            break;
          default:
        }
      });

      if (
        txt === textNum &&
        icon === iconNum &&
        image === imageNum &&
        shape === shapeNum
      ) {
        res.push(item);
      }
    });

    return res;
  },

  /**
   * 给数组排序, 通过传入需要比较的值做比较
   * @param {Array} arr 需要比较数组
   * @param {String} param 需要比较的属性值
   * @param {Boolean} reverse 排序相反，默认由小到大
   */
  sortListByParam(arr: any[], param: string, reverse: boolean) {
    if (!arr || arr.length <= 1) {
      return;
    }

    // 直接使用冒泡
    let rev: boolean = false || reverse;
    const len: number = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        let valueA = param ? arr[j][param] : arr[j];
        let valueB = param ? arr[j + 1][param] : arr[j + 1];

        if (rev) {
          // 由大到小
          if (valueA < valueB) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        } else {
          // 由小到大
          if (valueA > valueB) {
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
  },

  /**
   * 从节点列表中, 删除匹配后的节点
   * @param {Array} nodes 需要处理的节点
   * @param {Array} arr 需要减少的节点
   */
  removeMatchedNodes: function(nodes: any[], arr: any[]) {
    if (!nodes || nodes.length === 0 || !arr || arr.length === 0) {
      return;
    }

    arr.forEach((item: any) => {
      // 从nodes上移除
      for (let i = 0; i < nodes.length; i++) {
        if (item.id == nodes[i].id) {
          nodes.splice(i, 1);
          break;
        }
      }
    });
  },

  /**
   * 从元素模型列表中, 删除匹配后的元素
   * @param {Array} nodes 需要处理的节点
   * @param {Array<MatchData>} arr 需要减少的节点
   */
  removeMatchedDatas(nodes: any[], arr: any[]) {
    if (!nodes || nodes.length === 0 || !arr || arr.length === 0) {
      return;
    }

    // arr里面的是MatchData, nodes里面的是designjson数据, 所以要读取里面的节点, 然后移除
    arr.forEach((matchData: any) => {
      let removeNodes: any[] = matchData.getMatchNode();

      removeNodes.forEach((rnode: any) => {
        for (let i = 0; i < nodes.length; i++) {
          if (rnode.id == nodes[i].id) {
            nodes.splice(i, 1);
            break;
          }
        }
      });
    });
  },

  /**
   * 输出组件模型信息
   * @param datas Array<MatchData>
   */
  logWidgetInfo(datas: any[]) {
    if (!datas || datas.length === 0) {
      return;
    }

    datas.forEach((mData: any) => {
      let info = '';
      let id = mData.id;
      let modelName: string = mData.modelName;
      let matchNodes: any[] = mData._matchNodes;

      //info += id + ' - ';
      info += modelName + ' - ';
      info += 'children: ';

      for (let j = 0; j < matchNodes.length; j++) {
        let data = matchNodes[j];
        let name = data.modelName;
        info += name + ', ';
      }
      console.log(info);
    });
  },
};

// export default utils;
export default utils;
