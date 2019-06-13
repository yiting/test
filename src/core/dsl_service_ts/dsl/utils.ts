// 此模块用于定义一些在dsl模块包中用到的工具函数
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
   */
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
   * 从节点列表中, 删除匹配后的节点
   * @param {Array} nodes 需要处理的节点
   * @param {Array} arr 需要减少的节点
   */
  removeMatchedNodes(nodes: any[], arr: any[]) {
    if (!nodes || nodes.length === 0 || !arr || arr.length === 0) {
      return;
    }

    arr.forEach(item => {
      // 从nodes上移除
      for (let i = 0; i < nodes.length; i++) {
        if (item.id === nodes[i].id) {
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
    arr.forEach(matchData => {
      const removeNodes = matchData.getMatchNode();

      removeNodes.forEach((rnode: any) => {
        for (let i = 0; i < nodes.length; i++) {
          if (rnode.id === nodes[i].id) {
            nodes.splice(i, 1);
            break;
          }
        }
      });
    });
  },

  /**
   * 从数组中移除为null的节点
   * @param {Array} arr 移除为null的节点
   */
  removeNullObject(arr: any) {
    if (!arr || arr.length === 0) {
      return undefined;
    }

    const result: any = [];
    // 为了方便看, 倒序排
    // for (let i = arr.length - 1; i >= 0; i--) {
    //     if (arr[i] != null) {
    //         result.push(arr[i]);
    //     }
    // }
    arr.forEach((item: any) => {
      if (item != null) {
        result.push(item);
      }
    });

    return result;
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
    const resultTemp: any = [];

    // 筛选出用于匹配的各类型节点
    const textNodes: any = [];
    const iconNodes: any = [];
    const imageNodes: any = [];
    const shapeNodes: any = [];

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
    const typeRandom = [];
    typeRandom[0] = this.getRandomGroup(textNodes, textNum);
    typeRandom[1] = this.getRandomGroup(iconNodes, iconNum);
    typeRandom[2] = this.getRandomGroup(imageNodes, imageNum);
    typeRandom[3] = this.getRandomGroup(shapeNodes, shapeNum);

    const allGroups = [];
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
   * 从水平基线获取节点匹配
   * 可变节点模型获取节点的逻辑
   */
  getLineGroupFromNodes(nodes: any[]) {
    if (nodes.length === 0) {
      return [];
    }
    // 可变节点模型的关键是根据准则找出一组符合规则的节点, 这里的处理规则是:
    // 1. 元素的高度小于等于40
    // 2. 元素在y轴投影相交,并且可以找出一个元素在高度上包含了所有元素(上下浮动10)
    // 3. 元素间彼此相间距离小于30
    // 4. 元素数量大于等于3个
    // 规则1
    const regular1 = function(cnodes: any[]) {
      const res: any = [];
      cnodes.forEach(nd => {
        if (nd.height <= 40) {
          res.push(nd);
        }
      });
      return res;
    };

    // 规则2
    const regular2 = function(cnodes: any[]) {
      // y轴投影出各分组
      const res = [];
      for (let i = 0; i < cnodes.length; i++) {
        const nd = cnodes[i];

        if (res.length === 0) {
          const temp: any = [];
          temp.minH = nd.abY;
          temp.maxH = nd.abY + nd.height;
          temp.push(nd);

          res.push(temp);
        } else {
          let isHandle = false;
          for (let j = 0; j < res.length; j++) {
            const arr = res[j];
            // 与arr相交
            if (nd.abY + nd.height >= arr.minH && nd.abY <= arr.maxH) {
              arr.minH = nd.abY < arr.minH ? nd.abY : arr.minH;
              const ndabYops = nd.abY + nd.height;
              arr.maxH = ndabYops > arr.maxH ? ndabYops : arr.maxH;

              arr.push(nd);
              isHandle = true;
              break;
            }
          }

          if (!isHandle) {
            // 创建一个新数组处理
            const temp: any = [];
            temp.minH = nd.abY;
            temp.maxH = nd.abY + nd.height;
            temp.push(nd);
            res.push(temp);
          }
        }
      }

      // 每一组能找一个元素包含所有其它元素, 即有一个元素的最低abY和最大abY和arr的minH和maxH相等
      if (res.length === 0) {
        return res;
      }

      for (let i = 0; i < res.length; i++) {
        const groups = res[i];
        let isOneLine = false;

        for (let j = 0; j < groups.length; j++) {
          const node = groups[j];
          if (
            node.abY - 10 <= groups.minH &&
            node.abY + node.height + 10 >= groups.maxH
          ) {
            isOneLine = true;
            break;
          }
        }

        if (!isOneLine) {
          // 从res除移除
          res.splice(i, 1);
        }
      }

      return res;
    };

    // 规则3
    const regular3 = function(groups: any[]) {
      const res: any = [];
      if (groups.length === 0) {
        return res;
      }

      // 这里主要将groups里的所有节点按规则3去划分出多个数据段数组返回
      for (let i = 0; i < groups.length; i++) {
        const nodes2: any = groups[i];
        utils.sortListByParam(nodes2, 'abX', false);

        // 有间距小于30的节点则组成一组放入新数组
        let arr = [];
        if (nodes2.length === 1) {
          // 只有一个元素
          arr.push(nodes2[0]);
          res.push(arr);
          arr = [];
        } else {
          for (let j = 0; j < nodes2.length; j++) {
            if (j === 0) {
              arr.push(nodes2[j]);
            } else {
              const preNode = nodes2[j - 1];
              const curNode = nodes2[j];

              if (curNode.abX - (preNode.abX + preNode.width) <= 30) {
                arr.push(curNode);
              } else {
                // 存进res并重新开始新一组计算
                res.push(arr);
                arr = [];
                arr.push(curNode);
              }

              if (j === nodes.length - 1 && arr.length > 0) {
                // 最后一个元素时
                res.push(arr);
                arr = [];
              }
            }
          }
        }
      }
      return res;
    };

    // 规则4
    const regular4 = function(groups: any[]) {
      const res: any = [];
      if (groups.length === 0) {
        return res;
      }

      groups.forEach((cnodes: any[]) => {
        if (cnodes.length >= 3) {
          res.push(cnodes);
        }
      });
      return res;
    };

    // 节点匹配计算
    const g1 = regular1(nodes);
    const g2 = regular2(g1);
    const g3 = regular3(g2);
    // !重要,
    // g4代表有多少组可变节点模型
    const g4 = regular4(g3);

    return g4;
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

    const temp: [] = [];
    const res: [] = [];
    this.randomGroup(arr, n, 0, temp, 0, res);

    return res;
  },

  // 递归排列函数
  randomGroup(
    _arr: any[],
    _n: number,
    _begin: number,
    _temp: any[],
    _index: number,
    _result: any,
  ) {
    const arr: any = _arr;
    const n: any = _n;
    const begin: any = _begin;
    const temp: any = _temp;
    const index: any = _index;
    const result: any = _result;
    if (n === 0) {
      // 如果够n个数了
      const len = result.length;
      result[len] = [];

      temp.forEach((item: any) => {
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
  joinGroup(_arr: any[], _index: number, _resultTemp: any, _result: any) {
    const arr: any = _arr;
    const index: any = _index;
    const resultTemp: any = _resultTemp;
    const result: any = _result;
    if (!arr || arr.length === 0 || index < 0) {
      return;
    }

    if (index === arr.length) {
      const tmp: any[] = [];
      resultTemp.forEach((item: any) => {
        tmp.push(item);
      });
      result.push(tmp);

      return;
    }

    const group = arr[index];
    // 遍历元素进行组合
    for (let i = 0; i < group.length; i++) {
      const items = group[i];
      resultTemp[index] = items;
      // 进入下一个流程
      this.joinGroup(arr, index + 1, resultTemp, result);
    }
  },

  // 将二维数组转为一维
  transformToLinearArray(arr: []) {
    const res: any = [];
    arr.forEach((groups: [], index: number) => {
      res[index] = [];

      groups.forEach((items: []) => {
        items.forEach((item: any) => {
          res[index].push(item);
        });
      });
    });

    return res;
  },

  // 将数组中, 删除不符合textNum + iconNum + imageNum + shapeNum 的组合
  removeErrorGroup(
    arr: [],
    textNum: number,
    iconNum: number,
    imageNum: number,
    shapeNum: number,
  ) {
    const res: any = [];
    if (!arr || arr.length === 0) {
      return res;
    }

    arr.forEach((item: []) => {
      let txt = 0;
      let icon = 0;
      let image = 0;
      let shape = 0;

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

  // 屏幕输出组件信息
  logWidgetInfo(datas: []) {},

  // 屏幕输出元素信息
  logElementInfo(datas: []) {
    // 其实函数是通用的
    this.logWidgetInfo(datas);
  },

  /**
   * 将驼峰命名转为“-”分割的命名
   */
  nameLower(str: string) {
    return str.replace(/([A-Z])/gm, '-$1').toLowerCase();
  },

  getRangeByNodes(nodes: []) {
    if (!nodes) {
      return {};
    }
    const o = {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY,
      abX: Number.POSITIVE_INFINITY,
      abY: Number.POSITIVE_INFINITY,
      width: 0,
      height: 0,
    };
    let right = 0;
    let bottom = 0;
    nodes.forEach((d: any, i: number) => {
      const { height } = d;
      o.x = d.x < o.x ? d.x : o.x;
      o.y = d.y < o.y ? d.y : o.y;
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      right = right < d.abX + d.width ? d.abX + d.width : right;
      bottom = bottom < d.abY + d.height ? d.abY + d.height : bottom;
    });
    o.height = bottom - o.abY;
    o.width = right - o.abX;
    return o;
  },
  gatherByLogic(domArr: any[], logic: Function) {
    const newArr: any = [];
    domArr.forEach((meta, i) => {
      let st: any = newArr.find((n: any, k: number) => n.includes(meta));
      if (!st) {
        st = [meta];
        newArr.push(st);
      }
      domArr.forEach((target, j) => {
        if (target === meta || st.includes(target)) {
          return;
        }
        if (logic(meta, target)) {
          const qr = newArr.find((n: any, qi: number) => n.includes(target));
          if (qr) {
            newArr[newArr.indexOf(st)] = st.concat(qr);
            st = st.concat(qr);
            newArr.splice(newArr.indexOf(qr), 1);
          } else {
            st.push(target);
          }
        }
      });
    });
    return newArr;
  },
  calRange(nodes: any[]) {
    if (!nodes) {
      return {};
    }
    const o = {
      abX: Number.POSITIVE_INFINITY,
      abY: Number.POSITIVE_INFINITY,
      abYops: Number.NEGATIVE_INFINITY,
      abXops: Number.NEGATIVE_INFINITY,
      width: 0,
      height: 0,
    };
    nodes.forEach((d: any, i) => {
      o.abX = d.abX < o.abX ? d.abX : o.abX;
      o.abY = d.abY < o.abY ? d.abY : o.abY;
      o.abYops = o.abYops < d.abYops ? d.abYops : o.abYops;
      o.abXops = o.abXops < d.abXops ? d.abXops : o.abXops;
    });
    o.height = o.abYops - o.abY;
    o.width = o.abXops - o.abX;
    return o;
  },
  // 包含关系
  isWrap(outer: any, inner: any, dir: number = 0) {
    return this.isXWrap(outer, inner, dir) && this.isYWrap(outer, inner, dir);
  },
  // 在Y轴上是包含关系
  isYWrap(a: any, b: any, dir: number = 0) {
    return (
      Math.abs((a.abY + a.abYops) / 2 - (b.abY + b.abYops) / 2) <=
      Math.abs(a.abYops - a.abY - b.abYops + b.abY) / 2 + dir
    );
  },
  // 在X轴上是包含关系
  isXWrap(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return (
      Math.abs((a.abX + a.abXops) / 2 - (b.abX + b.abXops) / 2) <=
      Math.abs(a.abXops - a.abX - b.abXops + b.abX) / 2 + dir
    );
  },
  // 相连关系
  isConnect(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    return this.isXConnect(a, b, dir) && this.isYConnect(a, b, dir);
  },
  // 水平方向相连
  isXConnect(
    a: { abX: number; abXops: number },
    b: { abX: number; abXops: number },
    dir = 0,
  ) {
    const aCx = (a.abX + a.abXops) / 2;
    const bCx = (b.abX + b.abXops) / 2;
    return (
      Math.abs(aCx - bCx) <= (a.abXops - a.abX + b.abXops - b.abX) / 2 + dir
    );
  },
  // 垂直方向相连
  isYConnect(
    a: { abY: number; abYops: number },
    b: { abY: number; abYops: number },
    dir = 0,
  ) {
    const aCy = (a.abY + a.abYops) / 2;
    const bCy = (b.abY + b.abYops) / 2;
    return (
      Math.abs(aCy - bCy) <= (a.abYops - a.abY + b.abYops - b.abY) / 2 + dir
    );
  },
  /**
   * 是否垂直
   * 当doms数量只有一个,返回false
   */
  isVertical(arr: [], errorCoefficient: number = 0) {
    return !this.isHorizontal(arr, errorCoefficient);
    /* if (arr.length===0) {
                    return false;
                }
                let prev;
                errorCoefficient = parseFloat(errorCoefficient) || 0;
                return arr.every(dom => {
                    if (!prev) {
                        prev = dom;
                        return true;
                    }
                    let res = dom.abX < prev.abX + prev.width + errorCoefficient &&
                        prev.abX < dom.abX + dom.width + errorCoefficient;
                    prev = dom;
                    return res;
                }) */
  },
  horizontalLogic(a: any, b: any, errorCoefficient = 0) {
    if (
      // 如果水平方向相连
      this.isXConnect(a, b, errorCoefficient) &&
      // 如果垂直不包含
      !this.isYWrap(a, b)
    ) {
      return false;
    }
    // return (a_abY < b_abY + b_height + errorCoefficient) &&
    // (b_abY < a_abY + a_height + errorCoefficient);
    return this.isYConnect(a, b, errorCoefficient);
  },
  /**
   * 是否水平
   * logic：若垂直方向不相交，则水平方向相交为水平
   * 若垂直方向相交，则水平方向互相包含则水平
   * 当doms数量只有一个,返回true
   */
  isHorizontal(doms: any[], _errorCoefficient: any = 0) {
    const errorCoefficient = parseFloat(_errorCoefficient) || 0;
    const _ = this;
    return doms.every((a, i) => {
      const isFix = doms.every((b, j) => {
        const isFix2 = j <= i || _.horizontalLogic(a, b, errorCoefficient);
        return isFix2;
      });
      return isFix;
    });
  },
};

// export default utils;
export default utils;
