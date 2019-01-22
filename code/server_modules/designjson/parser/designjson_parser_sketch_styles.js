/**
 * 样式解析器
 */
const [Artboard,Group, Bitmap,Text,ShapeGroup,SymbolInstance,SymbolMaster,SliceLayer,Rectangle,Oval,Line,Triangle,Polygon,Star,Rounded,Arrow,ShapePath] = ['artboard','group', 'bitmap','text','shapeGroup','symbolInstance','symbolMaster','slice','rectangle','oval','line','triangle','polygon','star','rounded','arrow','shapePath'];
const NSArchiveParser = require('../NSArchiveParser/index');
const StyleParser = {
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
    _getBorderRadius(_class,points=[],frame) {
        let borderRadius = null;
        if (_class === Rectangle && points && points.length) {
            borderRadius = points.map(point => point.cornerRadius);
        } else if (_class === Oval && frame.width === frame.height) { // 圆形可以使用borderradius
            borderRadius = [frame.width/2,frame.width/2,frame.width/2,frame.width/2];
        }
        if (Array.isArray(borderRadius) && borderRadius.some(radius => !!radius)) return borderRadius;
        else return null;
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
        return shadowList.map(({ _class, offsetX: x, offsetY: y, spread, blurRadius: blur, color }) => {
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
        if (!color) return null;
        let {alpha,blue,green,red} = color;
        return {
            r: Math.round(red * 255),
            g: Math.round(green * 255),
            b: Math.round(blue * 255),
            a: alpha
        }
    },
    _getFont(textStyle,attributedString) {
        const textValue = attributedString.string;
        let fontStyle = function(ops = {}) {
            let { color = { r: 0, g: 0, b: 0, a: 1 }, string = '', font, size = 18 } = ops;
            this.color = color;
            this.string = string;
            this.font = font;
            this.size = size;
        }
        if (!attributedString.attributes) { // 低于50版本
            if (attributedString.archivedAttributedString && attributedString.archivedAttributedString['_archive']) {
                let data = attributedString.archivedAttributedString['_archive'];
                let {NSString,NSAttributes} = NSArchiveParser(data);
                const { NSFontNameAttribute: fontName, NSFontSizeAttribute: size } = NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes;
                return {texts: [new fontStyle({
                    color: this._getColor(NSAttributes.MSAttributedStringColorDictionaryAttribute),
                    string: NSString,
                    font: fontName,
                    size
                })]}
            }
            
            // if (!attributedString.archivedAttributedString || !attributedString.archivedAttributedString['_archives']) return { texts: [new fontStyle()] }
            return {texts: [new fontStyle()]}
        }
        const texts = attributedString.attributes.map(text => {
            const { name: fontName, size } = text.attributes.MSAttributedStringFontAttribute.attributes;
            return new fontStyle({
                color: this._getColor(text.attributes.MSAttributedStringColorAttribute),
                string: textValue.slice(text.location, text.location + text.length),
                // fontWeight: name.slice(0,2), // TODO
                font: fontName,
                size
            })
            
            
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
module.exports = StyleParser