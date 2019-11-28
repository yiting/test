import { anyTypeAnnotation } from "@babel/types";

// 一些节点匹配计算的工具函数
//
const utils = {
    /**
     * 获取节点上的单行元素,待优化
     * @param {Array} nodes 
     */
    getInlineNodes: function(nodes: any[]): any {
        // 单行元素的逻辑
        // 1. 元素的高度小于等于50
        // 2. 元素在间距上小于30, 中心基线相差不能大于10
        // 3. 元素数量大于等于2个
        let res: any = [];

        if (nodes.length === 0) {
            return res;
        }
        
        // 1.元素高度小于等于50
        let suitNodes: any = [];
        nodes.forEach((item: any, index: number) => {
            if (item.height <= 50 && (item.type == 'QText' || item.type == 'QImage' || item.type == 'QShape')) {
                suitNodes.push(item);
            }
        });

        // 2.元素在y轴投影相交
        this.sortListByParam(suitNodes, 'abX');
        let lineNodes: any = [];

        // for (let i = 0; i < suitNodes.length; i++) {
        //     let node = suitNodes[i];
        //     if (node.abX < 360) {
        //         console.log(node);
        //     }
        // }

        for (let i = 0; i < suitNodes.length; i++) {
            let item = suitNodes[i];

            if (i === 0) {
                let temp: any = [];
                temp.endX = item.abXops;
                temp.minH = item.abY;
                temp.maxH = item.abYops;
                temp.push(item);
                lineNodes.push(temp);
            }
            else {
                let canJoin = false;

                //
                // item.abXops - arr.endX <= 30
                //
                for (let j = 0; j < lineNodes.length; j++) {
                    let arr = lineNodes[j];

                    if ((item.abY < arr.maxH && item.abYops > arr.minH)
                        && (true)
                        ) {
                        // 更新参数
                        if (arr.minH > item.abY) {
                            arr.minH = item.abY;
                        }
                        else if (arr.maxH < item.abYops) {
                            arr.maxH = item.abYops;
                        }
                        else if (arr.endX < item.abXops) {
                            arr.endX = item.abXops;
                        }

                        arr.push(item);
                        canJoin = true;
                        break;
                    }
                }

                if (!canJoin) {
                    // 单独创建一组
                    let temp: any = [];
                    temp.endX = item.abXops;
                    temp.minH = item.abY;
                    temp.maxH = item.abYops;
                    temp.push(item);
                    lineNodes.push(temp);
                }
            }
        }

        // 多于两个元素的
        // for (let i = 0; i < lineNodes.length; i++) {
        //     let line = lineNodes[i];

        //     // if (line.length >= 2) {
                
        //     //     // for (let j = 0; j < line.length; j++) {
        //     //     //     console.log(line[j].abX + ' - ' + line[j].abY + ' - ' + line[j].abXops + ' - ' + line[j].abYops + ' - ' + line[j].id)
        //     //     // }

        //     //     // console.log('--------------');
        //     // }
        //     // else {
        //     //     let node = line[0];
        //     //     console.log(node.id + ' - ');
        //     // }

        // }

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
}

export default utils;
