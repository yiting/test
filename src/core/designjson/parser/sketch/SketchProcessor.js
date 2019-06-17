const {
  walkin,
  walkout,
  generateGroupAttr,
  mergeStyle,
  isBelong,
} = require('../../utils');
const { SKETCH_LAYER_TYPES } = require('./SketchLayerTypes');
const DesignTree = require('../../nodes/DesignTree');
/**
 * @class 针对Sketch图元预处理，包括位置设置、mask合并等
 */
class SketchProcessor {
  static process(node) {
    walkin(node, n => {
      this.setPropertyByParent(n);
      this.setPosition(n);
      this.setSymbolInstanceId(n);
      if (!n.children.length) return;
      this.setMaskRelation(n); // 设置mask关系
    });
    walkout(node, n => {
      this.shapeToImage(n);
      this.borderProcess(n);
      if (!n.children.length) return;
      this.maskToImage(n);
      this.modifySize(n);
    });
  }

  static setPosition(node) {
    if (node._origin.trimmed) {
      const { abX, abY, width, height } = node._origin.trimmed;
      Object.assign(node, { abX, abY, width, height });
    } else if (node._origin.frame) {
      const { x, y } = node._origin.frame;
      if (node.parent) {
        node.abX = node.parent.abX + Math.round(x);
        node.abY = node.parent.abY + Math.round(y);
      }
    }
  }

  static setMaskRelation(parent) {
    const members = parent.children;
    members.forEach(node => {
      if (isMaskShape(node)) {
        const maskedNodes = [];
        //收集mask关联的图层
        const index = members.indexOf(node);
        for (let i = index + 1; i < members.length; i++) {
          const brother = members[i];
          const brotherLayer = brother._origin;
          if (brotherLayer.shouldBreakMaskChain) break;
          maskedNodes.push(brother);
          brother._origin.maskNode = node;
        }
        node._origin.maskedNodes = maskedNodes;
      }
    });
  }

  static setSymbolInstanceId(node) {
    // 如果是symbol，设置实例字段
    if (node._origin._class === SKETCH_LAYER_TYPES.SymbolInstance) {
      if (Array.isArray(node.symbolRoot)) {
        node.symbolRoot.push(node.id);
      } else node.symbolRoot = [node.id];
      if (Array.isArray(node.symbolIdentity)) {
        node.symbolIdentity.push(node._origin.identity);
      } else node.symbolIdentity = [node._origin.identity];
    }
    const { parent } = node;
    if (parent && Array.isArray(parent.symbolRoot)) {
      // 如果是symbol子孙元素，设置实例字段，添加前缀
      node.id = `${parent.symbolRoot.map(sr => sr.slice(0, 4)).join('---')}---${
        node.id
      }`;
      node.symbolRoot = parent.symbolRoot;
      // console.log('增加前缀',uin)
    }
    if (parent && Array.isArray(parent.symbolIdentity)) {
      // 如果是symbol子孙元素，设置实例字段，添加前缀
      node.symbolIdentity = parent.symbolIdentity;
      // console.log('增加前缀',uin)
    }
  }

  static modifySize(parent) {
    [...parent.children].forEach(node => {
      if (node.children && node.children.length) {
        const frame = generateGroupAttr(node.children);
        Object.assign(node, frame);
      }
    });
  }
  static borderProcess(node) {
    const { border } = node.styles;
    if (!border) return;
    switch (border.position) {
      case 0:
        {
          // center
          node.width += border.width;
          node.height += border.width;
          node.abX -= border.width / 2;
          node.abY -= border.width / 2;
        }
        break;
      case 2:
        {
          // outside
          node.width += border.width * 2;
          node.height += border.width * 2;
          node.abX -= border.width;
          node.abY -= border.width;
        }
        break;
    }
  }
  static maskToImage(parent) {
    // const maskNodes = parent.children.filter(({type,isMasked,maskedNodes}) => type === QMask.name && !isMasked && Array.isArray(maskedNodes) && maskedNodes.length);
    const maskNodes = parent.children.filter(
      node => node._origin.maskedNodes && node._origin.maskedNodes.length,
    );
    maskNodes.forEach(maskNode => {
      // 将所有mask关联的节点合成组
      const m = maskNode._origin.maskedNodes.find(
        maskedNode => ~maskNodes.indexOf(maskedNode),
      );
      if (m) m._origin.maskedNodes = []; // 如果遮罩里套了子遮罩，则删除子遮罩数据
      if (!maskNode._origin.maskedNodes.length) return;
      const maskedCollection = [...maskNode._origin.maskedNodes];
      if (isUnavailableMask(maskNode, maskedCollection)) return;
      maskedCollection.unshift(maskNode);
      console.log('Mask合并：', parent.name);
      let node;
      if (maskedCollection.length === parent.children.length) {
        DesignTree.convert(parent, 'QImage');
        node = parent;
      } else {
        node = DesignTree.union(maskedCollection, 'QImage', false);
      }
      node.width = maskNode.width;
      node.height = maskNode.height;
      node.abX = maskNode.abX;
      node.abY = maskNode.abY;
      const keys = ['borderRadius', 'border', 'shadows'];
      mergeStyle(node, maskNode, keys);
      const { border } = node.styles;
      if (!border) return;
      switch (border.position) {
        case 0:
          {
            // center
            border.width /= 2;
          }
          break;
        case 1:
          {
            // inside
            node.styles.border = null;
          }
          break;
      }
    });
  }

  static shapeToImage(node) {
    switch (node.type) {
      // case 'QImage': return;
      // case 'QText': return; // TODO
      case 'QShape':
        {
          if (node.shapeType === SKETCH_LAYER_TYPES.Oval)
            node.shapeType = SKETCH_LAYER_TYPES.Rectangle; // 保留borderradius属性，去掉圆形属性
          const { shapeType, styles } = node;
          const isRectagnle =
            node.shapeType === SKETCH_LAYER_TYPES.Rectangle &&
            node._origin.points &&
            node._origin.points.length === 4 &&
            node._origin.points[0]._class === 'point';
          const isComplexShape = shapeType !== SKETCH_LAYER_TYPES.Rectangle;
          const isComplexBg =
            styles.background && styles.background.type === 'image';
          if (isComplexShape) {
            console.log('特殊形状转换：', node.name);
            DesignTree.convert(node, 'QImage');
            node.styles = {};
          } else if (isComplexBg) {
            console.log('特殊样式转换：', node.name);
            DesignTree.convert(node, 'QImage');
          }
          // return isComplexShape || isComplexBg
        }
        break;
      default:
        break;
    }
  }

  static setPropertyByParent(node) {
    if (!(node.parent && node.parent.styles)) return;
    if (node.parent.styles.shadows) {
      switch (node.type) {
        case 'QText':
          {
            node.styles.textShadows = node.parent.styles.shadows;
          }
          break;
        default:
          {
            node.styles.shadows = node.parent.styles.shadows;
          }
          break;
      }
      node.parent.styles.shadows = null;
    }
    if (node.parent.styles.opacity < 1) {
      node.styles.opacity *= node.parent.styles.opacity;
      node.parent.styles.opacity = 1;
    }
  }
}
function isMaskShape(node) {
  // 这里判断这个Layer是一个Mask还是一个图形
  return node.type === 'QShape' && node._origin.hasClippingMask;
}
function isUnavailableMask(maskNode, maskedNodes) {
  return maskedNodes.every(
    n =>
      isBelong(n, maskNode) &&
      n.width / maskNode.width < 0.9 &&
      n.width / maskNode.width < 0.9,
  );
}
module.exports = SketchProcessor;
