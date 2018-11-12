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
// const qlog = require('../log/qlog');
// const logger = qlog.getInstance(qlog.moduleData.img);
const [Artboard,Group, Bitmap,Text,ShapeGroup,SymbolInstance,SymbolMaster,SliceLayer,Rectangle,Oval,Line,Triangle,Polygon,Star,Rounded,Arrow,ShapePath] = ['artboard','group', 'bitmap','text','shapeGroup','symbolInstance','symbolMaster','slice','rectangle','oval','line','triangle','polygon','star','rounded','arrow','shapePath'];
const {walkin,walkout,hasMaskChild,hasCompleteSytle,generateGroupAttr,mergeStyle} = require('./designjson_utils');
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
        if (pnode.children && pnode.children.length === 1) {
            
            const {type,shapeType,styles} = pnode.children[0];
            if ((type === QShape.name || type === QMask.name) && shapeType != Rectangle && !isCircle(pnode.children[0])) { // QShape -> QImage
                this._convertToImageNode(pnode);
            }
        }
    }
    _maskMerge(maskNode,pnode) {
        const {_document} = this;
        const maskedCollection = maskNode.maskedNodes.map(id => _document.getNode(id));
        maskedCollection.unshift(maskNode);
        if (maskedCollection.length === pnode.children.length) {
            mergeStyle(pnode,maskNode,['borderRadius']);
            this._convertToImageNode(pnode);
        } else this._insertImageNode(pnode,maskedCollection,maskNode); // mask关联的节点立即合成新组
    }
    _mergeGroupToParent(nodes,pnode) {
        if(!nodes || !nodes.length) return;
        const targetNodes = nodes.filter((node) => node.type !== QText.name && node.type !== QLayer.name && !isBigNode(node,this._document._tree)); // 过滤掉文字节点、组节点、与父级重合的矩形
        if(!targetNodes.length) return;
        const groupArr = mergeJudge(targetNodes); // 根据规则输出 成组列表 [[node1,node2],[node3,node4],node5]
        if (groupArr.length === 1 && groupArr[0].length === pnode.children.length) {
            this._convertToImageNode(pnode);
            return;
        }
        groupArr.map(item => {
            (Array.isArray(item) && item.length > 1) && this._insertImageNode(pnode,item);
        });
    }
    // 将多个节点合并成QImage节点，并插入到父节点
    _insertImageNode(pnode,nodes,maskNode) {
        const obj = new QImage();

        obj.isModified = true;
        const [id,name] = nodes.reduce((p,c) => [ `${p[0]}_${c.id.slice(0,4)}`,`${p[1]}_${c.name}`],['','']);
        console.log('合并图片',name);
        obj.name = name;
        // obj.backgroundColor = null;
        obj.path = `${id}.png`;
        // 设置组的样式
        Object.assign(obj,generateGroupAttr(pnode,nodes));
        const new_node = this._document.addNode(id, obj, pnode); // 插入新节点
        if (nodes.length) new_node._imageChildren = [...nodes].map(n => {
            n.x = n.abX - new_node.abX;
            n.y = n.abY - new_node.abY;
            return n;
        });
        Object.assign(new_node,{children:[],childnum: 0,isLeaf: true,styles: {}});
        if (maskNode) Object.assign(new_node.styles,{borderRadius: maskNode.styles.borderRadius});
        nodes.forEach(({id}) => this._document.removeNode(id, pnode)); // 删除旧节点
    }
    // 将节点转换成QImage
    _convertToImageNode(node) {
        console.log('转化为图片',node.name);
        // const {id,name,}
        // Object.assign(node,new QImage(),{ path, type: QImage.name, id: node.id, name: node.name });
        node.type = QImage.name;
        node.path = `${node.id}.png`;
        node.shapeType && delete node.shapeType;
        node.styles = {borderRadius: node.styles.borderRadius || 0};
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
        walkout(_document._tree,node => {
            const {type,shapeType,styles} = node;
            if ((type === QShape.name || type === QMask.name) && shapeType != Rectangle && !isCircle(node)) { // QShape -> QImage
                this._convertToImageNode(node);
            }
            // 如果是没有背景图的矩形，可以直接转化为纯css的QLayer，否则转为合图的QImage
            if (shapeType === Rectangle || isCircle(node)) {
                if (styles.background && styles.background.type === 'image') this._convertToImageNode(node); // QShape -> QLayer
                else this._convertToLayerNode(node);
            }
            // (node.type === QImage.name) && images.push(node); // 更新组图片信息
        });
        // _document._images = images; // 生成图片信息列表，待export
    }
}
function isCircle({shapeType,styles}) {
    return shapeType === Oval && styles.borderRadius;
}
function isBigNode(node,rnode,threshold = 1.5/200) {
    const {width,height,abX,abY} = node;
    const size = width * height;
    return width > rnode.width * 0.8 || height > rnode.height * 0.8 || size >= rnode.width ** 2 * threshold;
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