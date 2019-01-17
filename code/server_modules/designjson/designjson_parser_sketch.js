// this package is use to translate sketch, photoshop, adobeXD 

const Logger = require('./logger')
// QNode类型
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
const {walkin,walkout,hasMaskChild,hasComplexSytle,generateGroupAttr,isPureColor} = require('./designjson_utils');
// layer类型
const BORDER_TYPES = {Center: 0,Outside: 2,Inside: 1};
const [Artboard,Group, Bitmap,Text,ShapeGroup,SymbolInstance,SymbolMaster,SliceLayer,Rectangle,Oval,Line,Triangle,Polygon,Star,Rounded,Arrow,ShapePath] = ['artboard','group', 'bitmap','text','shapeGroup','symbolInstance','symbolMaster','slice','rectangle','oval','line','triangle','polygon','star','rounded','arrow','shapePath'];
/**
 * 传入json并解析
 * @param {String} artboradId
 * @param {Array} pageList sketch pages json
 * @param {String} pageArtBoardIndex
 * @param {Object} documentjson sketch document.json
 */
let parse = function(artboradId, pageList, pageArtBoardIndex, documentjson) {
    try {
        // Sketch的数据解析逻辑
        // 传入的数据只能是Artboard类型为根节点或者Symbol类型为根节点
        // _parseFromArtboard
        // _parseFromSymbol
        const symbolMasterLayerMap = getSymbolMasterLayerMap(pageList);
        const foreinSymbolMasterLayerMap = getForeinSymbolMasterLayerMap(documentjson);
        let symbolMap = {
            ...symbolMasterLayerMap,
            ...foreinSymbolMasterLayerMap
        }
        const { artboard: artboardLayer, pageId } = getArtboardLayer(artboradId,pageList,pageArtBoardIndex);
        if (artboardLayer && artboardLayer._class === Artboard) {
            const _document = _parseFromArtboard(artboardLayer,symbolMap);
            modifySize(_document)
            return { document: _document, pageId };
            // return null; // symbol
        } else {
            return { pageId };
        }
    } catch(err) {
        Logger.error('数据解析报错！');
    }
}
const styleParser = {
    getSyle({ _class, style, rotation, attributedString, frame, points, hasBackgroundColor,  backgroundColor }) {
        const opacity = style.contextSettings ? (+style.contextSettings.opacity).toFixed(4) : 1;
        const { borders, shadows: outterShadows, innerShadows, fills, textStyle } = style;
        let background = null, shadows, border, borderRadius;
        background =  this._getBackground(hasBackgroundColor,backgroundColor,fills)
        if (!background || background.type != 'image') {
            shadows = this._getShadows([...(outterShadows || []),...(innerShadows || [])]);
            border = this._getBorder(borders);
            borderRadius =  this._getBorderRadius(_class,points,frame);
        }
        // const backgroundColor = bgColor ? this._getColor(bgColor) : fills[0];
        const styles = {
            borderRadius,
            border,
            opacity,
            rotation,
            shadows,
            background
        };
        switch(_class) {
            case Text: Object.assign(styles,this._getFont(textStyle,attributedString,frame.height));break;
        }
        return styles;
    },
    _getBorderRadius(_class,points,frame) {
        if (_class === Rectangle) {
            return points.map(point => point.cornerRadius);
        }
        if (_class === Oval && frame.width === frame.height) { // 圆形可以使用borderradius
            return [frame.width/2,frame.width/2,frame.width/2,frame.width/2];
        }
        return [0,0,0,0];
    },
    __getBorderRadius(_class,points,frame) {
        if (_class === Rectangle) {
            return points[0].cornerRadius;
        }
        if (_class === Oval && frame.width === frame.height) { // 圆形可以使用borderradius
            return frame.width/2;
        }
        return 0;
    },
    _getBackground(hasBackgroundColor,backgroundColor,fills) {
        let background = {
            type: 'image',
            color: null,
            hasOpacity: false
        };
        if (hasBackgroundColor) {
            background.type = 'color';
            background.color = this._getColor(backgroundColor);
            return background;
        }
        if (fills && fills.length) {
            fills = fills.filter(({isEnabled}) => !!isEnabled);
            if (!fills.length) return null;
            else if (fills.length > 1 ) return background;
            const fill = fills[0];
            const opacity = fill.contextSettings && fill.contextSettings.opacity ;
            switch(fill.fillType) {
                case 0: {
                    background.type = 'color';
                    background.color = this._getColor(fill.color);
                    if (background.color.a !== 1) background.hasOpacity = true;
                } break; // 纯色背景
                case 1: {
                    const { stops, gradientType, elipseLength } = fill.gradient;
                    if (gradientType === 0) { // 线性渐变
                        background.type = 'linear';
                    } else if (gradientType === 1) { // 径向渐变
                        background.type = 'radical';
                        background.r = elipseLength;
                    }
                    const [from,to] = [fill.gradient.from.slice(1,-1).split(','),fill.gradient.to.slice(1,-1).split(',')];
                    background.x = from[0], background.y = from[1],
                    background.x1 = to[0], background.y1 = to[1];
                    background.colorStops = stops.map(stop => {
                        const color = this._getColor(stop.color);
                        if (!isNaN(opacity)) color.a *= opacity; // 如果存在opacity，则与颜色alpha通道进行合并
                        if (color.a !== 1) background.hasOpacity = true;
                        return {
                            color,
                            offset: stop.position
                        }
                    });
                }; break; // 渐变
                default: break;
            }
            return background;
        } else return null;
    },
    _getBorder(borders) { // 获取边框 （坑点：多个边框叠加暂未考虑）
        if(!borders || !borders.length) return null;
        borders = borders.filter(({isEnabled}) => !!isEnabled);
        if (!borders.length) return null;
        return {
            type: 'solid',
            color: this._getColor(borders[0].color),
            width: borders[0].thickness,
            position: borders[0].position
        }
    },
    _getShadows(shadowList) {
        if(!shadowList.length) return null;
        shadowList.map(({ _class, offsetX: x, offsetY: y, spread, blurRadius: blur, color }) => {
            const type = _class === 'shadow' ? 'inset': 'initial'
            return {
                type,
                x,
                y,
                color: this._getColor(color),
                spread,
                blur
            }
        })
    },
    _getColor(color) {
        if (!color) return {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        }
        let {alpha,blue,green,red} = color;
        return {
            r: Math.round(red * 255),
            g: Math.round(green * 255),
            b: Math.round(blue * 255),
            a: alpha
        }
    },
    _getFont(textStyle,attributedString,height) {
        const textValue = attributedString.string;
        const texts = attributedString.attributes.map(text => {
            const { name: fontName, size } = text.attributes.MSAttributedStringFontAttribute.attributes;
            return {
                color: this._getColor(text.attributes.MSAttributedStringColorAttribute),
                string: textValue.slice(text.location, text.location + text.length),
                // fontWeight: name.slice(0,2), // TODO
                font: fontName,
                size
            }
        });
        if (!textStyle) return { texts }
        const {verticalAlignment: verticalAlign, encodedAttributes} = textStyle;
        if (!encodedAttributes.paragraphStyle) return { texts, verticalAlign }
        return {
            texts,
            verticalAlign,
            textAlign: encodedAttributes.paragraphStyle.alignment || 0,
            lineHeight: encodedAttributes.paragraphStyle.maximumLineHeight || null
        }
    }
}
/**
 * 解析Artboard数据
 * 
 */
// let _parseFromArtboard = function(data, designArtboard, designStyle, designImage) {

// }
let getArtboardLayer = function(artboradId,inputList,pageArtBoardIndex) {
    for(let json of inputList) {
        const index = json.layers.findIndex(({do_objectID, _class}) => do_objectID === artboradId);
        if (~index) {
            let artboard = json.layers[index];
            artboard.index = pageArtBoardIndex;
            return { artboard, pageId: json.do_objectID};
        }
    }
    return null
}
let getSymbolMasterLayerMap = function(inputList = []) {
    let obj = {},arr = [];
    for(let json of inputList) {
        arr = arr.concat(json.layers.filter(layer => layer._class === SymbolMaster));
    }
    arr.forEach(layer => obj[layer.symbolID] = layer);
    return obj;
}
let getForeinSymbolMasterLayerMap = function(json = {}) {
    let obj = {};
    if (!json.foreignSymbols || !json.foreignSymbols.length) return null;
    let arr = json.foreignSymbols.filter(obj => obj.symbolMaster._class === SymbolMaster).map(obj => obj.symbolMaster);
    arr.forEach(layer => obj[layer.symbolID] = layer);
    return obj;
}
let _parseFromArtboard = function(artboardLayer,symbolMasterLayerMap) {
    // 初始化一棵新树
    let _document = new QDocument();
    _document._symbolMasterLayers = symbolMasterLayerMap;
    _parseLayer(_document, artboardLayer, null);
    return _document;
}
/**
 * 解析sketch结构并生成虚拟树
 * @param {QDocument} _document domtree
 * @param {SketchLayer} layer 解析到的sketch层级类
 * @param {QNode} pnode 父节点
 */
let _parseLayer = function(_document, layer, pnode = null, brotherLayers = null) {
    // 隐藏的就不读出来
    if (!layer.isVisible) return;

    // 共同的属性
    let uin = layer.do_objectID;
    let layerType = layer._class;
    let obj = null;                     // 具体QObject
    let curNode = null;                 // 生成的节点
    // 根据不同类型初始化不同object
    switch(layerType) {
        case Artboard:
            //log('MSArtboardGroup: ' + uin);
            obj = new QBody();
            obj.bodyIndex = layer.index;
            break;
        case Group:
            //log('MSLayerGroup: ' + uin);
            obj = new QLayer();
            break;
        case Bitmap:
            //log('MSBitmapLayer: ' + uin);
            obj = new QImage();
            // 临时设置图片路径
            obj.path = `${uin}.png`;
            // document.addImage(layer);
            break;
        case Text:
            //log('MSTextLayer: ' + uin);
            obj = new QText();
            obj.text = layer.attributedString.string;
            break;
        case SliceLayer:
            // 切图标识
            //log('MSSliceLayer: ' + uin);
            // obj = new QSlice();
            // //收集mask关联的图层
            // const brotherLayers = pnode._origin.layers;
            // brotherLayers.filter(({_class,isVisible}) => _class !== SliceLayer && isVisible)；
            // break;
            return;
        case SymbolInstance:
            // obj = new QSymbol();
            obj = new QLayer();
            
            break;
        default:
            if (~[ShapeGroup,Rectangle,Oval,Line,Triangle,Polygon,Star,Rounded,Arrow,ShapePath].indexOf(layerType)) {
                if (layer.hasClippingMask) {
                    // 这里判断这个Layer是一个Mask还是一个图形
                    obj = new QMask();
                } else {
                    obj = new QShape();
                    //log('shapetype: ' + obj.shapeType + ': ' + uin);
                }
                _setSketchShapeType(layer, obj);
                break;
            } else {
                console.log('遇到没有处理的类型: ' + layerType);
                return;
            }
    }
    
    // 如果是symbol，设置实例字段
    if (layerType === SymbolInstance) {
        if (Array.isArray(obj.symbolRoot)) obj.symbolRoot.push(uin.slice(0,4));
        else obj.symbolRoot = [uin.slice(0,4)];
    }
    if (pnode && Array.isArray(pnode.symbolRoot)) { // 如果是symbol子孙元素，设置实例字段，添加前缀
        uin = `${pnode.symbolRoot.join('#')}#${uin}`;
        obj.symbolRoot = pnode.symbolRoot;
        // console.log('增加前缀',uin)
    }
    
    
    // Symbol合并
    if (layerType === SymbolInstance) {
        setAttrByLayer(obj,layer);
        let instanceLayer = layer;
        layer = _document._symbolMasterLayers[layer.symbolID];
        if(!layer) throw '找不到Symbol';
        const {x,y} = obj;
        setAttrByLayer(obj,layer);
        Object.assign(obj,{x,y,_origin: {
            ...instanceLayer
        }});
    } else {
        setAttrByLayer(obj,layer);
    }
    setPureColor(obj); // 如果元素为纯色背景，设置元素底色属性
    

    if (layerType === Bitmap) obj.styles = {};
    setAbsoulutePostion(obj,pnode);
    maskProcess(uin,obj,layer, brotherLayers);
    textProcess(uin,obj,layer);
    // 创建根节点
    curNode = _document.addNode(uin, obj, pnode);
    // if (pnode) curNode._originParent = pnode.id;
    // 继续递归
    if (layerType == Artboard || layerType == Group || layerType == SymbolInstance) {
        let sublayers = layer.layers;
        for (let i = 0; i < sublayers.length; i++) {
            let sblayer = sublayers[i];
            _parseLayer(_document, sblayer, curNode,sublayers);
        }
    }
}
let setPureColor = obj => {
    if (isPureColor(obj) && !obj.isMasked) obj.pureColor = obj.styles.background.color; //设置元素底色
}
let textProcess = function(uin,obj, layer) {
    if (obj.type != QText.name || (!obj.styles.border && !obj.styles.background)) return;
    console.log('转化为图片',obj.name);
    // const {id,name,}
    // Object.assign(node,new QImage(),{ path, type: QImage.name, id: node.id, name: node.name });
    obj.type = QImage.name;
    obj.path = `${uin}.png`;
}
let maskProcess = function(uin,obj, layer, brotherLayers) {
    if (obj.type == QMask.name) {
        const maskedNodes = [];
        //收集mask关联的图层
        if (brotherLayers && brotherLayers.length) {
            const index = brotherLayers.indexOf(layer);
            for(let i = index + 1; i < brotherLayers.length; i++) {
                const brotherLayer = brotherLayers[i];
                if(brotherLayer.shouldBreakMaskChain) break;
                if(brotherLayer.isVisible) {
                    let _id = (Array.isArray(obj.symbolRoot)) ? `${obj.symbolRoot.join('#')}#${brotherLayer.do_objectID}` : brotherLayer.do_objectID;
                    maskedNodes.push(_id);
                }
                brotherLayer.maskNode = uin;
            }
        }
        obj.maskedNodes = maskedNodes;
    }
    if(layer.maskNode){
        obj.isMasked = true;
        obj.maskNode=layer.maskNode;
    }else{
        obj.isMasked = false;
    }
}
// 设置QNode属性
let setAttrByLayer = function(obj,layer) {
    obj.name = layer.name;
    const {height,width,x,y} = layer.frame;
    const styles = styleParser.getSyle(layer);
    Object.assign(obj,{
        height: Math.round(height),
        width: Math.round(width),
        x: Math.round(x),
        y: Math.round(y),
        styles,
        _origin: {
            ...layer
            // layers: layer._class === ShapeGroup ? layer.layers : null
        }
    });

}
// 设置绝对位置
let setAbsoulutePostion = function(obj,pnodeObj) {
    if(!pnodeObj) { // 根节点则绝对位置为(0,0)
        Object.assign(obj,{
            abX: 0,
            abY: 0
        });
    } else {
        const { x, y } = obj;
        const [abX,abY] = [ pnodeObj.abX + x, pnodeObj.abY + y ];
        Object.assign(obj,{
            abX,
            abY
        });
    }
}
/**
 * 设置QShape的shapeType属性，线、矩形、圆，多边形等
 * @param {Layer} layer Sketch对象
 * @param {QShape} qShape QShape对象
 */
let _setSketchShapeType = function(layer, obj) {
    // let shapes = layer.layers;
    obj.shapeType = layer._class;

    // // 如果shape group由多个shape组成则当成是一个
    // // 矢量图组
    // if (shapes.length > 1) {
    //     qShape.shapeType = 'combineShape';
    // }
}
/** 
 * 设置QShape的shapeType属性，线、矩形、圆，多边形等
 * @param {Layer} layer Sketch对象
 * @param {QShape} qShape QShape对象
 */
let __setSketchShapeType = function(layer, qShape) {
    // 这里只获取第一个图形来做判断(通常设计师在ShapeGroup里只放一个shape?)
    let shapes = layer.layers;
    let shape = shapes[0];
    let layerType = shape._class;
    qShape.shapeType = layerType;

    // 如果shape group由多个shape组成则当成是一个
    // 矢量图组
    if (shapes.length > 1) {
        qShape.shapeType = 'combineShape';
    }
}
let modifySize = function(_document) {
    walkout(_document._tree,pnode => {
        if(!pnode.children || !pnode.children.length) return;
        const arr1 = [...pnode.children].filter(node => !node.isMasked);
        
        arr1.forEach(node => {
            if (node.children && node.children.length) {
                let frame = generateGroupAttr(pnode,node.children);
                Object.assign(node,frame);
                node.children.forEach(n => {
                    n.x = n.abX - node.abX;
                    n.y = n.abY - node.abY;
                });
            } else {
                const { border } = node.styles;
                if (!border) return;
                switch(border.position) {
                    case BORDER_TYPES.Center: { 
                        if (_expand(node,border.width/2)) {
                            border.width /= 2;
                        }
                    } break;
                    case BORDER_TYPES.Outside: { 
                        _expand(node,border.width)
                    } break;
                }
                delete border.position;
            }
        })
    });
}
let _expand = function(node,val) {
    node.abX -= val;
    node.abY -= val;
    node.width += 2 * val;
    node.height += 2 * val;
    let [overflowX,overflowY] = [node.x - val < 0,node.y - val < 0]
    node.x = node.x - val;
    node.y = node.y - val;
    return overflowX || overflowY;
}
// 对外接口
module.exports = {
    parse
}