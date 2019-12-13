// 此模块用于定义一些在dsl模块包中用到的工具函数
//
import Common from './common';

const utils = {
  /**
   * 给数组排序, 通过传入需要比较的值做比较
   * @param {Array} arr 需要比较数组
   * @param {String} param 需要比较的属性值
   * @param {Boolean} reverse 排序相反，默认由小到大
   */
  sortListByParam(_arr: any, param: string, reverse: boolean = false) {
    const arr = _arr;
    if (!arr || arr.length <= 1) {
      return;
    }

    // 直接使用冒泡
    const rev = false || reverse;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        const valueA = param ? arr[j][param] : arr[j];
        const valueB = param ? arr[j + 1][param] : arr[j + 1];

        if (rev && valueA < valueB) {
          const temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        } else if (valueA > valueB) {
          // 由小到大
          const temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  /**
   * 将模型按优先级进行排序, 优先级相同则按数量优先
   * @param {Array} list 模型列表
   */
  sortModelList(list: any[]) {
    const arr: any = [];
    const len = list.length;
    list.forEach(item => {
      arr.push(item);
    });

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (arr[j].priority < arr[j + 1].priority) {
          const temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        } else if (arr[j].priority === arr[j + 1].priority) {
          if (arr[j].getNumber() < arr[j + 1].getNumber()) {
            const temp = arr[j + 1];
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
   * @param {Int} imageNum 组合里的QImage元素数量
   */
  getGroupFromNodes(nodes: any, textNum: number, imageNum: number) {
    if (!nodes || !nodes.length || nodes.length === 0) {
      return null;
    }
    // 为了减少计算量, 这里不需做完全随机, 这里分两步优化, 输进来的nodes节点已根据尺寸分步输入, 减少节点两
    // 通过textNum, imageNum的数量来做随机
    const typeNum = 4;
    let result: any = [];
    let resultTemp: any = [];

    // 筛选出用于匹配的各类型节点
    let textNodes: any = [];
    let imageNodes: any = [];

    nodes.forEach((item: any) => {
      switch (item.type) {
        case Common.QText:
          textNodes.push(item);
          break;
        case Common.QImage:
          imageNodes.push(item);
          break;
        default:
          break;
      }
    });

    // 根据每类元素需要的个数获取所有可以排列的组合,然后再对这四类进行排列
    let typeRandom = [];
    typeRandom[0] = this.getRandomGroup(textNodes, textNum);
    typeRandom[1] = this.getRandomGroup(imageNodes, imageNum);

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
    // 将组合里面不符合textNum,imageNum的组合去掉
    result = this.removeErrorGroup(result, textNum, imageNum);

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

  // 将数组中, 删除不符合textNum + imageNum 的组合
  removeErrorGroup(arr: any[], textNum: number, imageNum: number) {
    let res: any[] = [];
    if (!arr || arr.length === 0) {
      return res;
    }

    arr.forEach((item: any) => {
      let txt: number = 0;
      let image: number = 0;

      item.forEach((obj: any) => {
        switch (obj.type) {
          case Common.QText:
            txt += 1;
            break;
          case Common.QImage:
            image += 1;
            break;
          default:
        }
      });

      if (txt === textNum && image === imageNum) {
        res.push(item);
      }
    });

    return res;
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
};

// export default utils;
export default utils;
