// 可变节点模型, 用于匹配单行文本
//
const Common = require('../../dsl_common.js');
const Model = require('../../dsl_model.js');
const Utils = require('../../dsl_utils.js');

let emxModelList = require('../emxlist.js');
let sortEmxModelList = Utils.sortModelList(emxModelList);
//console.log(sortEmxModelList);

class EMXM1 extends Model.ElementXModel {
    constructor() {
        // 无限节点
        super('emx-m1', 0, 0, 0, 0, Common.LvSS, Common.QText);

        // this.canLeftFlex = false;
        // this.canRightFlex = false;
    }

    // 改写
    isMatch(nodes) {
        // 重新初始化存放匹配的数据
        this._matchDatas = [];    
        this._nodes = [];  

        // 传进来的节点已经在获取时做了可变节点元素模型的逻辑判断处理
        // 这里只需再细分匹配了哪些基础元素模型, 组织模型的返回数据就好
        // 所以默认直接返回true就好
        // 模型的匹配
        sortEmxModelList.forEach(matchModel => {
            let groups = Utils.getGroupFromNodes(nodes, matchModel.getTextNumber(), matchModel.getIconNumber(), matchModel.getImageNumber(), matchModel.getShapeNumber());
            
            if (groups && groups.length > 0) {
                for (let i = 0; i < groups.length; i++) {
                    let isMatched = false;
                    let group = groups[i];
                    // 这里要做一个处理，匹配完的节点就不再进行匹配
                    // 以防同一节点匹配到多个组件模型，因为组件模型已有优先级
                    // 所以节点等于有了优先匹配选择
                    for (let j = 0; j < group.length; j++) {
                        let node = group[j];
    
                        if (node.isMatched) {
                            isMatched = true;
                            break;
                        }
                    }
    
                    if (isMatched) {
                        continue;
                    }
    
                    let bool = matchModel.isMatch(group);
    
                    if (bool) {
                        // 生成匹配数据
                        this._matchDatas.push(matchModel.getMatchData());
                        Utils.removeMatchedNodes(nodes, group);
                    }
                }
            }
        });
        // 对元素做一次abX的排序
        Utils.sortListByParam(this._matchDatas, 'abX');
        // 匹配完所有
        this._whenMatched();

        return true;
    }

    // 改写
    _whenMatched() {
        this._initMatchParam();
    }

    // 改写
    _initMatchParam() {
        // 根据匹配出的基础模型计算出模型的各参数
        for (let i = 0; i < this._matchDatas.length; i++) {
            let node = this._matchDatas[i];

            if (i == 0) {
                this.abX = node.abX;
                this.abY = node.abY;
                this.abXops = node.abX + node.width;
                this.abYops = node.abY + node.height;
                this.zIndex = node.zIndex;                  // 层级的设定
                continue;
            }
            
            // 比较大小得出这个组件的大小
            this.abX = (this.abX < node.abX)? this.abX : node.abX;
            this.abY = (this.abY < node.abY)? this.abY : node.abY;
            this.abXops = (this.abXops < node.abX + node.width)? node.abX + node.width : this.abXops;
            this.abYops = (this.abYops < node.abY + node.height)? node.abY + node.height : this.abYops;
            // zIndex取最低那个
            this.zIndex = this.zIndex > node.zIndex? node.zIndex : this.zIndex;
        }

        this.width = Math.abs(this.abXops - this.abX);
        this.height = Math.abs(this.abYops - this.abY);
    }
}


module.exports = EMXM1;
