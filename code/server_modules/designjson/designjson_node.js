// this module is define the abstract node and tree structure
const Logger = require('./logger')

// 依赖的模块
const {serialize,walkin,hasStyle} = require('./designjson_utils');
let RepeatProcessor = require('./designjson_repeat_processor');
const OUTPUT_PATH = 'images';
/**
 * 基础节点类
 */
class QObject {
    constructor() {
        // id
        this.id = null;
        // 类型
        this.type = 'QObject';
        // 图层名
        this.name = "";
        // 长度
        this.width = 0;
        // 宽度
        this.height = 0;
        // x坐标
        this.x = 0;
        // y坐标
        this.y = 0;
        // 相对于坐标原点(左上角的位置)
        this.abX = 0;
        // 相对于坐标原点(左上角的位置)
        this.abY = 0;
    }
}

/**
 * 基础层级或组类
 */
class QLayer extends QObject {
    constructor() {
        super();
        this.type = 'QLayer';
    }
}
/**
 * 根元素
 */
class QBody extends QLayer {
    constructor() {
        super();
        this.type = 'QBody';
    }
}

/**
 * 图片层类
 */
class QImage extends QLayer {
    constructor() {
        super();
        this.type = 'QImage';
        this.path = '';             // 图片路径
    }
}

/**
 * 文本层类
 */
class QText extends QObject {
    constructor() {
        super();
        this.type = 'QText';
        this.text = '';             // 文字内容
    }
}

/**
 * 图形层类
 */
class QShape extends QObject {
    constructor() {
        super();
        this.type = 'QShape';
        this.shapeType = 'Shape';      // 属于一个什么图形
    }
}
/**
 * 叠加遮罩样式层
 */
class QMask extends QObject {
    constructor() {
        super();
        this.type = 'QMask';
    }
}

/**
 * 切图标识
 */
class QSlice extends QObject {
    constructor() {
        super();
        this.type = 'QSlice';
    }
}

/**
 * 用于构建的虚拟树
 * 树的节点储存信息为QObject类型
 */
/**
 * 用于构建的虚拟树
 * 树的节点储存信息为QObject类型
 */
class QDocument {
    constructor() {
        this._tree = null;
        this._images = [];          // 用于输出图片的记录
    }

    /**
     * 添加节点
     * @param {Sketch ID} id 
     * @param {QObject} qobject 
     * @param {父节点} parent 
     * @param {Boolean} isInsert 是否插入到父级第一个元素 
     */
    addNode(id, qobject, parent) {
        let node = this._makeNode(id, qobject);

        if (!parent) {
            // 根节点
            this._tree = node;
        }
        else {
            node.parent = parent.id;
            parent.children.push(node);
            node.zIndex = node.childnum;
            parent.childnum++;
        }

        return node;
    }
    /**
     * 移动节点
     * @param {Sketch ID} id 
     * @param {父节点} parent 
     * @param {Number} index 移到父节点下索引为index的位置，默认为末端
     */
    moveNode(id,parent,index = Array.isArray(parent.children) && parent.children.length) {
        const currentNode = this.getNode(id);
        this.removeNode(id);
        currentNode.x = currentNode.abX - parent.abX;
        currentNode.y = currentNode.abY - parent.abY;
        currentNode.parent = parent.id;
        parent.isModified = true;
        if(Array.isArray(parent.children)) {
            parent.children.splice(index,0,currentNode); // 在特定位置添加元素
        } else parent.children = [currentNode];
        parent.childnum = parent.children.length;
        parent.isLeaf = false;
    }
    /**
     * 删除子节点
     * @param {Sketch ID} id 
     * @param {父节点} parent 非必输
     */
    removeNode(id,parent) {
        try {
            parent = parent || this.getParentNode(id);
            parent.isModified = true;
            const currentNode = parent.children.find(node => node.id === id);
            if(currentNode.isMasked) {
                const maskNode = parent.children.find(node => node.id === currentNode.maskNode);
                if(maskNode) {
                    maskNode.maskedNodes = maskNode.maskedNodes.filter(node => node.id !== id)
                }
            }
            // if(!parent.children || !parent.children.length) return; // 叶节点
            parent.children = parent.children.filter(node => node.id !== id);
            parent.childnum = parent.children.length;
            if (parent.childnum === 0) parent.isLeaf = true;
            currentNode.parent = null;
        } catch(err) {
            Logger.warn('节点删除失败')
        }
    }
    /**
     * 获取节点
     * @param {Sketch ID} id 
     */
    getNode(id) {
        const nodes = serialize(this._tree);
        return this._getNodeByList(id,nodes);
    }
    /**
     * 获取父节点
     * @param {Sketch ID} id 
     */
    getParentNode(id) {
        const nodes = serialize(this._tree);
        const node = this._getNodeByList(id,nodes);
        const parent = this._getNodeByList(node.parent,nodes);
        return parent;
    }
    /**
     * 获取祖父节点列表
     * @param {Sketch ID} id 
     * @return {Array.<QNode>}
     */
    getParentList(id) {
        const nodes = serialize(this._tree);
        const node = this._getNodeByList(id,nodes);
        let parent = this._getNodeByList(node.parent,nodes);
        const parentList = [];
        while(parent) {
            parentList.push(parent);
            parent = this._getNodeByList(parent.parent,nodes);
        }
        return parentList;
    }
    _getNodeByList(id,nodes) {
        return nodes.find(n => n.id === id);
    }
    /**
     * 储存图片
     * @param {MSBitmapLayer} layer 
     */
    addImage(layer) {
        this._images.push(layer);
    }

    /**
     * 返回解析中遇到的图片层
     */
    getImage() {
        const _images = [];
        walkin(this._tree,node => {
            if(node.type === QImage.name) _images.push(node);
        })
        // const rules = ['children','styles','parent','childnum','isLeaf','constraints'];break;
        _images.forEach((node,i) => {
            node.path = `${OUTPUT_PATH}/${this._tree.bodyIndex}-${i}.png`
        });
        try {
            RepeatProcessor(_images);
        } catch(err) {
            Logger.error('图片去重报错！')
        }
        return _images.map(({
            id, name, type, width, height, x, y, abX, abY, isMasked, maskedNodes, maskNode, path, _imageChildren, _origin,isModified
        }) => {
        // if(node.type != QShape.name) delete node._origin.layers;

        if(_origin) _origin = {
            ..._origin,
            layers: 'shapeGroup' === _origin._class ? _origin.layers : null
        }
            return {
                id, name, type, width, height, x, y, abX, abY, isMasked, maskedNodes, maskNode, path, _imageChildren,
                _origin,isModified
            }
        });
    }

    /**
     * 解析出json数据
     */
    toJson(type = 0) {
        let res = {}, rules;
        switch(type) {
            case 0: rules = ['_origin','_imageChildren','isMasked','maskNode','maskedNodes','isLeaf','pureColor','zIndex'];break;
        }
        this._setValueToJson(res, this._tree, rules);

        return res;
    }
    /**
     * 平铺树节点
     */
    toList() {
        const rules = ['_origin','_imageChildren','isMasked','maskNode','maskedNodes','isLeaf','pureColor','zIndex'];
        return serialize(this._tree)
        .map(node => {
            const res = {};
            for (let key in node) {
                // 除去不需要的
                if(~rules.indexOf(key)) continue;
                if (key === 'children') res[key] = node[key].map(({id}) => id);
                else res[key] = node[key];
            }
            res.hasStyle = hasStyle(node);
            return res;
        })
    }
    /**
     * 设置json值
     * @param {Object} res json对象
     * @param {TreeNode} node 节点 
     */
    _setValueToJson(res, node, rules) {
        for (let key in node) {
            // 除去不需要的
            if(~rules.indexOf(key)) continue;
            res[key] = node[key];
        }

        // 继续递归
        if (node.childnum != 0) {
            res.children = [];
            
            for (let i = 0; i < node.childnum; i++) {
                res.children[i] = {};
                this._setValueToJson(res.children[i], node.children[i],rules);
            }
        }
    }

    /**
     * 生成子节点
     */
    _makeNode(id,qobject) {
        return {
            ...qobject,
            id,
            parent: null,
            children: [],
            childnum: 0,          // 所拥有子节点数
            zIndex: 0,            // 节点的层级，越小越上面
            isLeaf: false        // 是否为子叶
        };
    }
}

// 对外接口
module.exports = {
    QDocument,
    QObject,
    QLayer,
    QBody,
    QImage,
    QText,
    QShape,
    QMask,
    QSlice
}