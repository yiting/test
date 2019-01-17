
const Logger = require('../logger')
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
} = require('../designjson_node');
// const qlog = require('../log/qlog');
// const logger = qlog.getInstance(qlog.moduleData.img);
const [Artboard,Group, Bitmap,Text,ShapeGroup,SymbolInstance,SymbolMaster,SliceLayer,Rectangle,Oval,Line,Triangle,Polygon,Star,Rounded,Arrow,ShapePath] = ['artboard','group', 'bitmap','text','shapeGroup','symbolInstance','symbolMaster','slice','rectangle','oval','line','triangle','polygon','star','rounded','arrow','shapePath'];
const {walkin,walkout,serialize,hasMaskChild,isPureColor,hasComplexSytle,generateGroupAttr,mergeStyle} = require('../designjson_utils');
/**
 * 优化树的结构
 * @param {QDocument} _document 
 */
let process = function(_document) {
    try {
        const processor = new _ImageMergeProcessor(_document);
        processor.merge() // 合并图片
    } catch (err) {
        Logger.error('图元合并报错！');
    }
}
class _ImageMergeProcessor {
    constructor(_document) {
        this._document = _document;
    }
    merge() { // 组合成图片
        walkout(this._document._tree,this._nodeMerge.bind(this));
        this.mergeByColor();
        this._updateTreeImages(this._document);
    }
    mergeByColor() {
        const {_document} = this;
        let nodes = serialize(_document._tree);
        // let colorImgNodes = this._getPureImage(nodes);
        const pureColorNodes = nodes.filter(node => !!node.pureColor);
        const groupArr = mergeColorJudge(pureColorNodes);
        groupArr.map(item => {
            item.size > 1 && this._insertImageNode(_document._tree,[...item]);
        });
        // for (let imageNode of colorImgNodes) {
        //     const relateNodes = bgNodes.filter(bgNode => isColorConnect(bgNode,imageNode));
        //     if (!relateNodes.length) continue;
        //     relateNodes.push(imageNode)
        //     this._insertImageNode(_document._tree,relateNodes);
        // }
    }
    _getPureImage(nodes) {
        return nodes.filter(n => n.type === QImage.name && n.pureColor);
    }
    _nodeMerge(pnode) { // 规则判断
        if (pnode.children && pnode.children.length > 1 && !pnode.isMasked) {
            if(hasMaskChild(pnode)) {
                const maskNodes = pnode.children.filter(({type,isMasked,maskedNodes}) => type === QMask.name && !isMasked && Array.isArray(maskedNodes) && maskedNodes.length);
                const notMaskedNodes = pnode.children.filter(({type,isMasked,maskedNodes}) => !isMasked && !(Array.isArray(maskedNodes) && maskedNodes.length));
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
        const {_document} = this;
        if(!nodes || !nodes.length) return;
        const targetNodes = nodes.filter((node) => node.type !== QText.name && node.type !== QLayer.name && !isBigNode(node,_document._tree)); // 过滤掉文字节点、组节点
        if(!targetNodes.length) return;
        const groupArr = mergeJudge(targetNodes); // 根据规则输出 成组列表 [[node1,node2],[node3,node4],node5]
        if (groupArr.length === 1 && groupArr[0].size === pnode.children.length) {
            this._convertToImageNode(pnode);
            return;
        }
        groupArr.map(item => {
            item.size > 1 && this._insertImageNode(pnode,[...item]);
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
        else {
            new_node.pureColor = this.getNodesCommonColor(nodes);
        }
        nodes.forEach(({id}) => this._document.removeNode(id)); // 删除旧节点
    }
    getNodesCommonColor(nodes) {
        let commonColor = null;
        for (let i = 0; i < nodes.length; i++) {
            let _color = null;
            if (nodes[i].pureColor) _color = nodes[i].pureColor;
            else return null;
            if (i === 0) commonColor = _color;
            else if (isSameColor(commonColor,_color)) continue;
            else return null;
        }
        return commonColor;
    }
    // 将节点转换成QImage
    _convertToImageNode(node) {
        console.log('转化为图片',node.name);
        // const {id,name,}
        // Object.assign(node,new QImage(),{ path, type: QImage.name, id: node.id, name: node.name });
        node.type = QImage.name;
        node.path = `${node.id}.png`;
        node.shapeType && delete node.shapeType;
        node.styles = {borderRadius: node.styles.borderRadius || [0,0,0,0]};
        if (node.children && node.children.length) node._imageChildren = [...node.children];
        node.pureColor = this.getNodesCommonColor(node.children);
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
function isColorConnect(node1,node2) {
    if(!isSameColor(node1.styles.background.color,node2.pureColor)) return false;
    return !(
        (node1.y + node1.height < node2.y) || (node1.y > node2.y + node2.height) ||
        (node1.x + node1.width < node2.x) || (node1.x > node2.x + node2.width)
    )
}
function isSameColor(color1,color2) {
    return JSON.stringify(color1) === JSON.stringify(color2)
}
function isCircle({shapeType,styles}) {
    return shapeType === Oval && styles.borderRadius;
}
function isBigNode(node,rnode,threshold = 1/2) {
    const {width,height,abX,abY} = node;
    const size = width * height;
    return size >= rnode.width ** 2 * threshold;
}
function mergeJudge(nodelist,distanceThreshold=20,sizeThreshold=4) {
    //碰撞检测
    let groups = []
    let relations = [];
    for (let i = 0; i < nodelist.length; i++) {
        let node = nodelist[i];
        for (let j = i + 1; j < nodelist.length; j++) {
            let brother = nodelist[j];
            if (mergeDistanceJudge(node,brother,distanceThreshold) && mergeSizeJudge(node,brother,sizeThreshold) && mergeShapeJudge(node,brother)) {
                relations.push([node,brother])
            }
        }

    }
    relations.map(([node,brother]) => {
        let res = [];
        // 查找当前边的两个端点是否已经成过组
        res = groups.filter(group => {
            return group.has(node) || group.has(brother)
        })
        if(res.length) {
            if (res.length > 1) {
                let unionGroup = res.reduce((p,c) => p.concat([...c]),[]);
                res.forEach(g => groups.splice(groups.indexOf(g),1));
                groups.push(new Set(unionGroup).add(node).add(brother));
            } else res[0].add(node).add(brother); // 如果已经存在组，则把节点加到原有组上
        } else groups.push(new Set([node,brother])) // 否则，自成一组
    })
    return groups;
}
// 判断两个元素距离是否相近
function mergeDistanceJudge(node,brother,threshold) {
    return !(
        (node.abY + node.height + threshold < brother.abY) || (node.abY > brother.abY + brother.height + threshold) ||
        (node.abX + node.width + threshold < brother.abX) || (node.abX > brother.abX + brother.width + threshold)
    )
};
// 判断两个元素大小是否相似
function mergeSizeJudge(node,brother,threshold,minSize = 10000) {
    let nodeSize = node.height * node.width;
    let brotherSize = brother.height * brother.width;
    if (nodeSize < minSize && brotherSize < minSize) return true; // 如果小于minsize，则无需判断大小相似度
    if (nodeSize > brotherSize) {
        return nodeSize / brotherSize < threshold;
    } else return brotherSize / nodeSize < threshold;
}
// 判断两个元素形状是否为活图
function mergeShapeJudge(node,brother,minSize = 10000) {
    let nodeSize = node.height * node.width;
    let brotherSize = brother.height * brother.width;
    if (nodeSize < minSize || brotherSize < minSize) return true; // 如果小于minsize，则无需判断是否活图
    let res = node.width === brother.width && node.height === brother.height && node.type == brother.type;
    if (node.type != QShape.name) {
        return !res;
    } else {
        return !(node.shapeType === brother.shapeType && ~[Oval,Rectangle,ShapeGroup].indexOf(node.shapeType)) ;
    }
}
function mergeColorJudge(nodelist,threshold=1) {
    //碰撞检测
    const collisionWithRect = (box1, box2) => {
        return !(
            (box1.abY + box1.height + threshold < box2.abY) || (box1.abY > box2.abY + box2.height + threshold) ||
            (box1.abX + box1.width + threshold < box2.abX) || (box1.abX > box2.abX + box2.width + threshold)
        ) &&  isSameColor(box1.pureColor,box2.pureColor)
    };
    let groups = []
    let relations = [];
    for (let i = 0; i < nodelist.length; i++) {
        let node = nodelist[i];
        for (let j = i + 1; j < nodelist.length; j++) {
            let brother = nodelist[j];
            if (collisionWithRect(node,brother)) {
                relations.push([node,brother])
            }
        }

    }
    relations.map(([node,brother]) => {
        let index = -1;
        // 查找当前边的两个端点是否已经成过组
        index = groups.findIndex(group => {
            return group.has(node) || group.has(brother)
        })
        if(~index) groups[index].add(node).add(brother); // 如果已经存在组，则把节点加到原有组上
        else groups.push(new Set([node,brother])) // 否则，自成一组
    })
    return groups;
}
const _mergeJudge = (boxArray,threshold=20) => {
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