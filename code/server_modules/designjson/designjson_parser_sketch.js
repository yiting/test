// this package is use to translate sketch, photoshop, adobeXD 

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
// layer类型
const [Artboard,Group, Bitmap,Text,ShapeGroup,SymbolInstance,SymbolMaster,SliceLayer] = ['artboard','group', 'bitmap','text','shapeGroup','symbolInstance','symbolMaster','slice'];
/**
 * 传入json并解析
 * @param {Json} data 通过sk,ps,xd解析得到的json数据
 * @param {Object} opts 配置参数
 * @param {Int} opts.type 解析json的类型, 1:sketch, 2:ps, 3:xd
 * @param {Object} designArtboard 解析完Artboard储存的对象
 * @param {Object} designSymbol 解析完Symbol储存的对象
 * @param {Object} designStyle 解析完的样式对象
 * @param {Array} designImage 需要合并的节点记录
 */
let parse = function(artboradId, inputList) {
    // Sketch的数据解析逻辑
    // 传入的数据只能是Artboard类型为根节点或者Symbol类型为根节点
    // _parseFromArtboard
    // _parseFromSymbol
    const symbolMasterLayerMap = getSymbolMasterLayerMap(inputList);
    const artboardLayer = getArtboardLayer(artboradId,inputList);
    if (!artboardLayer) return null; // symbol
    const _document = _parseFromArtboard(artboardLayer,symbolMasterLayerMap);
    return _document;
}

const styleParser = {
    getSyle({ _class, style, rotation, attributedString, frame }) {
        const opacity = style.contextSettings ? (+style.contextSettings.opacity).toFixed(4) : 1;
        const { borders, fixedRadius, shadows: outterShadows, innerShadows, fills, textStyle } = style;
        const shadows = this._getShadows([...(outterShadows || []),...(innerShadows || [])]);
        const border = this._getBorder(borders);
        let background = null;
        background =  this._getBackground(fills)
        // const backgroundColor = bgColor ? this._getColor(bgColor) : fills[0];
        const styles = {
            borderRadius: fixedRadius || 0,
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
    _getBackground(fills) {
        if (!fills || !fills.length) return null;
        const background = {
            type: 'image',
            color: null
        };
        fills = fills.filter(({isEnabled}) => !!isEnabled);
        if (!fills.length) return null;
        else if (fills.length > 1 ) return background;
        const fill = fills[0];
        const opacity = fill.contextSettings && fill.contextSettings.opacity ;
        switch(fill.fillType) {
            case 0: {
                background.type = 'color';
                background.color = this._getColor(fill.color);
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
                    return {
                        color,
                        offset: stop.position
                    }
                });
            }; break; // 渐变
            default: break;
        }
        return background;
    },
    _getBorder(borders) {
        if(!borders || !borders.length) return null;
        borders = borders.filter(({isEnabled}) => !!isEnabled);
        if (!borders.length) return null;
        return {
            type: 'solid',
            color: this._getColor(borders[0].color),
            width: borders[0].thickness
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
    _getColor({alpha,blue,green,red}) {
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
                string: textValue.slice(text.location, text.length),
                // fontWeight: name.slice(0,2), // TODO
                font: fontName,
                size
            }
        });
        const {verticalAlignment: verticalAlign, encodedAttributes} = textStyle;
        return {
            texts,
            verticalAlign,
            textAlign: encodedAttributes.paragraphStyle.alignment || 0,
            lineHeight: encodedAttributes.paragraphStyle.maximumLineHeight || height
        }
    }
}
/**
 * 解析Artboard数据
 * 
 */
// let _parseFromArtboard = function(data, designArtboard, designStyle, designImage) {

// }
let getArtboardLayer = function(artboradId,inputList) {
    for(let json of inputList) {
        const arr = json.layers.filter(({do_objectID, _class}) => do_objectID === artboradId && _class === Artboard);
        if (arr.length) {
            return arr[0];
        }
    }
    return null
}
let getSymbolMasterLayerMap = function(inputList) {
    let obj = {},arr = [];
    for(let json of inputList) {
        arr = arr.concat(json.layers.filter(layer => layer._class === SymbolMaster));
    }
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
let _parseLayer = function(_document, layer, pnode = null) {
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
        case ShapeGroup:
            //log('MSShapeGroup: ' + uin);
            // 这里判断这个ShapeGroup是一个Mask还是一个图形
            if (layer.hasClippingMask) {
                obj = new QMask();
                const maskedNodes = [];
                //收集mask关联的图层
                const brotherLayers = pnode._origin.layers;
                const index = brotherLayers.indexOf(layer);
                for(let i = index + 1; i < brotherLayers.length; i++) {
                    const brotherLayer = brotherLayers[i];
                    if(brotherLayer.shouldBreakMaskChain) break;
                    if(brotherLayer.isVisible) maskedNodes.push(brotherLayer.do_objectID);
                    brotherLayer.maskNode = uin;
                }
                obj.maskedNodes = maskedNodes;
            } else {
                obj = new QShape();
                _setSketchShapeType(layer, obj);
                //log('shapetype: ' + obj.shapeType + ': ' + uin);
            }
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
            // 迭代不需要的
            console.log('遇到没有处理的类型: ' + layerType);
            return;
    }
    if(layer.maskNode){
        obj.isMasked = true;
        obj.maskNode=layer.maskNode;
    }else{
        obj.isMasked = false;
    }
    
    // 设置样式属性（共有属性、私有属性）
    setAttrByLayer(obj,layer);
    // Symbol合并
    if (layerType === SymbolInstance) {
        layer = _document._symbolMasterLayers[layer.symbolID];
        if(!layer) throw '找不到Symbol';
        const {x,y} = obj;
        setAttrByLayer(obj,layer);
        Object.assign(obj,{x,y});
    }
    if (layerType === Bitmap) obj.styles = {};
    setAbsoulutePostion(obj,pnode);
    // 创建根节点
    curNode = _document.addNode(uin, obj, pnode);
    // if (pnode) curNode._originParent = pnode.id;
    // 继续递归
    if (layerType == Artboard || layerType == Group || layerType == SymbolInstance) {
        let sublayers = layer.layers;
        for (let i = 0; i < sublayers.length; i++) {
            let sblayer = sublayers[i];
            _parseLayer(_document, sblayer, curNode);
        }
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
let _setSketchShapeType = function(layer, qShape) {
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


// 对外接口
module.exports = {
    parse
}

