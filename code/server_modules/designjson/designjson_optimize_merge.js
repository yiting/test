// optimize模块用于优化及合并树// QNode类型，消除QMask与QShape
const {
    QDocument, 
    QLayer, 
    QBody, 
    QImage, 
    QText, 
    QShape,
    QMask, 
    QSlice
} = require('./designjson_node');
const {walkin,walkout,hasMaskChild,hasCompleteSytle,generateGroupAttr} = require('./designjson_utils');
/**
 * 优化树的结构
 * @param {QDocument} _document 
 */
let process = function(_document) {
    const processor = new _ImageMergeProcessor(_document);
    processor.merge() // 合并图片
}
class _ImageMergeProcessor {
    constructor(_document) {
        this._document = _document;
    }
    merge() { // 组合成图片
        walkout(this._document._tree,this._nodeMerge.bind(this));
        this._updateTreeImages(this._document);
    }
    _nodeMerge(pnode) { // 规则判断
        // if(pnode.type != QShape.name) delete pnode._origin.layers;
        if (pnode.children && pnode.children.length > 1 && !pnode.isMasked) {
            if(hasMaskChild(pnode)) {
                const maskNodes = pnode.children.filter(({type,isMasked}) => type === QMask.name && !isMasked);
                const notMaskedNodes = pnode.children.filter(({type,isMasked}) => type != QMask.name && !isMasked);
                maskNodes.forEach( maskNode => this._maskMerge(maskNode,pnode)); // 将所有mask关联的节点合成组
                this._mergeGroupToParent(notMaskedNodes,pnode); // 非mask关联则进行规则判断合并
            } else {
                this._mergeGroupToParent(pnode.children,pnode)
            }
        }
    }
    _maskMerge(maskNode,pnode) {
        const {_document} = this;
        const maskedCollection = maskNode.maskedNodes.map(id => _document.getNode(id));
        maskedCollection.unshift(maskNode);
        this._insertImageNode(pnode,maskedCollection); // mask关联的节点立即合成新组
    }
    _mergeGroupToParent(nodes,pnode) {
        if(!nodes || !nodes.length) return;
        const targetNodes = nodes.filter((node) => node.type !== QText.name && node.type !== QLayer.name && !isBigNode(node,pnode,this._document._tree)); // 过滤掉文字节点、组节点、与父级重合的矩形
        if(!targetNodes.length) return;
        const groupArr = mergeJudge(targetNodes); // 根据规则输出 成组列表 [[node1,node2],[node3,node4],node5]
        groupArr.map(item => {
            (Array.isArray(item) && item.length > 1) && this._insertImageNode(pnode,item);
        });
    }
    // 将多个节点合并成QImage节点，并插入到父节点
    _insertImageNode(pnode,nodes) {
        const obj = new QImage();
        const [id,name] = nodes.reduce((p,c) => [ `${p[0]}_${c.id.slice(0,4)}`,`${p[1]}_${c.name}`],['','']);
        console.log('合并图片',name);
        obj.name = name;
        // obj.backgroundColor = null;
        obj.path = `${id}.png`;
        // 设置组的样式
        Object.assign(obj,generateGroupAttr(nodes));
        const new_node = this._document.addNode(id, obj, pnode); // 插入新节点
        if (nodes.length) new_node._imageChildren = [...nodes];
        Object.assign(new_node,{children:[],childnum: 0,isLeaf: true});
        nodes.forEach(({id}) => this._document.removeNode(id, pnode)); // 删除旧节点
    }
    // 将节点转换成QImage
    _convertToImageNode(node) {
        // const {id,name,}
        // Object.assign(node,new QImage(),{ path, type: QImage.name, id: node.id, name: node.name });
        node.type = QImage.name;
        node.path = `${node.id}.png`;
        node.styles = {};
        if (node.children && node.children.length) node._imageChildren = [...node.children];
        node.children = [];
        node.isLeaf = true, node.childnum = 0;
        // this.tree._images.push(node.id); // 添加组图片信息
    }
    _convertToLayerNode(node) { // 将rectangle矩形转为QLayer
        node.type = QLayer.name;
    }
    // 将树的QImage和QShape的id插入列表，等待export.js输出
    _updateTreeImages(_document) {
        const images = [];
        walkout(_document._tree,node => {
            const {type,shapeType,styles} = node;
            if (type === QShape.name && shapeType != 'rectangle') { // QShape -> QImage
                this._convertToImageNode(node);
            }
            // if (node.name === 'Rectangle 353 Copy 5') debugger
            if (shapeType === 'rectangle') {
                if (styles.background && styles.background.type === 'image') this._convertToImageNode(node); // QShape -> QLayer
                else this._convertToLayerNode(node);
            }
            // (node.type === QImage.name) && images.push(node); // 更新组图片信息
        });
        // _document._images = images; // 生成图片信息列表，待export
    }
}
function isBigNode(node,pnode,rnode,threshold = 1/200) {
    const {width,height,abX,abY} = node;
    const size = width * height;
    return size >= rnode.width ** 2 * threshold || size >= pnode.width * pnode.height;
}
const mergeJudge = (boxArray,threshold=20) => {
    //分组
    let group = [];
    let groupIndex = 1;
    //碰撞检测
    const collisionWithRect = (box1, box2) => {
        return !(
            (box1.y + box1.height + threshold < box2.y) || (box1.y > box2.y + box2.height + threshold) ||
            (box1.x + box1.width + threshold < box2.x) || (box1.x > box2.x + box2.width + threshold)
        )
    };
    //分组逻辑
    boxArray.map((item, index) => {
        if (group.length == 0) {
            item.group = groupIndex;
            group[0] = item;
        } else {
            for (let i = 0; i < group.length; i++) {
                if (collisionWithRect(group[i], item)) {
                    item.group = group[i].group;
                    group.push(item);
                    break;
                } else {
                    if (i == (group.length - 1)) {
                        item.group = ++groupIndex;
                        group.push(item)
                        break;
                    }
                }
            }
        }
    })
    //转换格式
    let idGroup = {};
    group.map((item, index) => {
        if (idGroup[item.group]) {
            idGroup[item.group].push(item);
        } else {
            idGroup[item.group] = [];
            idGroup[item.group].push(item);
        }
    })
    group = [];
    for (let i in idGroup) {
        group.push(idGroup[i])
    }
    return group;
}

module.exports = process