// 此模块用于定义一些在dsl模块包中用到的工具函数
//
const utils = {
  /**
   * 给数组排序, 通过传入需要比较的值做比较
   * @param {Array} arr 需要比较数组
   * @param {String} param 需要比较的属性值
   * @param {Boolean} reverse 排序相反，默认由小到大
   */
  sortListByParam(_arr: any, param: string, reverse: boolean) {
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
   * 从传入的nodes中,根据beginX, beginY, optimizeWidth, optimizeHeight参数
   * 获取对应范围的的node节点
   * @param {Array} nodes 需要分范围获取的节点
   * @param {Int} beginX 范围开始的x坐标
   * @param {Int} beginY 范围开始的y坐标
   * @param {Int} optimizeWidth 范围的宽度
   * @param {Int} optimizeHeight 范围的高度
   */
  /*
  getNodesFromSize(
    nodes: any[],
    beginX: number,
    beginY: number,
    optimizeWidth: number,
    optimizeHeight: number,
  ) {
    const result: any = [];
    nodes.forEach(item => {
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
  */
};

// export default utils;
export default utils;
