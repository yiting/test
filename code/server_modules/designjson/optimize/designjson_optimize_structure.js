const Logger = require('../logger')
const {
    QDocument, 
    QLayer, 
    QBody, 
    QImage, 
    QText, 
    QShape,
    QMask
} = require('../designjson_node');
const {serialize,walkin,walkout,hasMaskChild,hasComplexSytle,isPureColor} = require('../designjson_utils');
let process = function(_document) {
    try {
        // 树层级关系预处理
        const processor = new _StructureProcessor(_document);
        processor.clear() // 清洗元素
        processor.justify() // 调整层级
    } catch (err) {
        Logger.error('结构优化报错！');
    }

}
// 树结构预处理  先清洗被覆盖的节点，再根据视觉嵌套关系层级调整
class _StructureProcessor {
    constructor(_document) {
        this._document = _document;
    }
    _getTargetList(_document) { // 候选父节点集合
        let arr = [];
        walkin(_document._tree,node => {
            if(!node.children || !node.children.length) return;
            if(hasComplexSytle(node)) return; // 包含影响子元素的属性：opacity,transform的节点不参与
            if(hasMaskChild(node) || hasMaskChild(_document.getNode(node.parent))) return; // 包含QMask的节点不参与，兄弟有QMask的节点也不参与(替换) TODO 该节点是否是Mask
            arr.push(node); 
        });
        // 根元素不参与调整
        return arr;
    }
    // 获取视觉面积最小的嵌套节点
    _getVisualParent(node,arr) {
        const parentList = arr.filter(parent => node != parent && is_A_belong_B(node,parent) && node.width * node.height != parent.width * parent.height); // 重叠不参与
        if(!parentList.length) return null;
        if(parentList.length === 1) return parentList[0];
        const minSize = Math.min(...parentList.map(({ width,height }) => width * height));
        const minParentList = parentList.filter(({ width,height }) => width * height === minSize);
        if(minParentList.length === 1) return minParentList[0]; // 面积最小父节点只有一个，则返回
        else return minParentList.pop();// TODO 候选父节点策略待定
    }
    clear() { // 清理被覆盖的节点
        const {_document} = this;
        let nodelist = serialize(_document._tree);
        walkin(_document._tree,pnode => {
            if(!pnode.children || !pnode.children.length) return;
            const arr1 = [...pnode.children].filter(node => !node.isMasked && node.type != QMask.name);
            arr1.forEach(node => {
                let res = this.isTransparent(node) || this.isCovered(node,nodelist) || this.isCamouflage(node,nodelist);
                if(res) {
                    _document.removeNode(node.id,pnode);
                    console.log(node.name + '被清理');
                    nodelist = serialize(_document._tree);
                }
            });
        });
        return _document;
    }
    // _clear() { // 清理被覆盖的节点
    //     const {_document} = this;
    //     walkin(_document._tree,pnode => {
    //         if(!pnode.children || !pnode.children.length) return;
    //         if(hasMaskChild(pnode)) return; // 含QMask节点不参与
    //         const arr1 = [...pnode.children];
    //         arr1.forEach(node => {
    //             if(res) {
    //                 _document.removeNode(node.id,pnode);
    //                 console.log(node.name + '被清理');
    //             }
    //         })
    //     });
    //     return _document;
    // }
    justify() { // 根据嵌套关系调整层级结构
        const {_document} = this;
        const _arr = this._getTargetList(_document);
        walkout(_document._tree,node => {
            if (!node.parent) return;
            const parent = _document.getNode(node.parent);
            if(hasMaskChild(parent)) return; // 如果自身或者兄弟有mask节点，则不参与调整
            const visual_parent = this._getVisualParent(node,_arr); // 获取视觉面积最小的嵌套节点
            if(visual_parent && parent.id !== visual_parent.id && parent.width * parent.height > visual_parent.width * visual_parent.height) { // 如果候选父节点不是原先父节点，而且面积还小于原先父节点
                // 组复制
                // Skbase.action.moveLayer(node,visual_parent);
                // 移动节点
                const nodelist = serialize(_document._tree);
                let index = nodelist.indexOf(node) > nodelist.indexOf(visual_parent) ?  visual_parent.children.length : 0;
                _document.moveNode(node.id, visual_parent, index);
                console.log(node.name,'从',parent.name,'移动到',visual_parent.name);
            }
        })
        return _document;
    }
    // 节点是否被覆盖
    isCovered(node,nodelist) {
        const {_document} = this;
        const index = nodelist.indexOf(node);
        const arr2 = nodelist.slice(index + 1).filter(n => {
            const parentList = _document.getParentList(n.id);
            return !~parentList.indexOf(node);
        }); // 越往后节点的z-index越大
        return arr2.some(brother => brother.type !==QLayer.name && is_A_belong_B(node,brother) && !hasComplexSytle(brother)); // 如果节点被兄弟覆盖，并且自己没有其它属性（shadow）影响到兄弟，则移除该节点
        // const res = arr2.find(brother => is_A_belong_B(node,brother) && !hasComplexSytle(brother)); // 如果节点被兄弟覆盖，并且自己没有其它属性（shadow）影响到兄弟，则移除该节点
        // if(res) {
        //     _document.removeNode(node.id);
        //     console.log(node.name + '被清理，因为被' + res.name + '覆盖了。');
        // }
    }
    isTransparent(node) {
        return +node.styles.opacity === 0;
    }
    // 节点颜色是否与背景同色
    isCamouflage(node,nodelist) {
        if (!isPureColor(node)) return false;
        let backgroundColor = node.styles.background.color;
        const node_index = nodelist.indexOf(node);
        const bgNode = nodelist.slice(0,node_index).reverse().find(n => isPureColor(n) && isSameColor(backgroundColor,n.styles.background.color) && is_A_belong_B(node,n));
        if(!bgNode) return false;
        const bgNode_index = nodelist.indexOf(bgNode);
        if (bgNode_index + 1 < node_index) return !nodelist.slice(bgNode_index + 1,node_index).some(n => n.type !==QLayer.name && is_A_collide_B(node,n));
        else return false;
    }
} 
function is_A_belong_B(a,b) { // 视觉上A是否被B嵌套
    return a.abX >= b.abX && a.abY >= b.abY && a.abX + a.width <= b.abX + b.width && a.abY + a.height <= b.abY + b.height;
}
function is_A_collide_B(a,b) {
    return !(a.abX > b.abX + b.width || a.abY > b.abY + b.height || b.abX > a.abX + a.width || b.abY > a.abY + a.height);
}
function isSameColor(colorA,colorB) {
    return JSON.stringify(colorA) === JSON.stringify(colorB)
}
module.exports = process;