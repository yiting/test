import { debug } from 'util';
import QLog from '../../log/qlog';

const Loger = QLog.getInstance(QLog.moduleData.render);

class ClassName {
  static classIndex: number;

  static domCache: any;

  static classCache: any;

  static classNameCache: any;

  static similarClassCache: any;

  static classPathCache: any;

  static getDomClassPath(_data: any) {
    const str = [];
    if (_data.selfClassName) {
      str.push(_data.selfClassName);
    }
    if (_data.similarClassName) {
      str.push(_data.similarClassName);
    }
    let classStr = str.join(':');
    if (_data.parent) {
      classStr = `${ClassName.getDomClassPath(_data.parent)}|${classStr}`;
    }

    return classStr;
  }

  static existsClassCoverDom(cssPath: string) {
    return ClassName.classNameCache.some((cssArr: []) => {
      const regStr = cssArr.join('\\|(.+\\|)*');
      return new RegExp(regStr, 'i').test(cssPath);
    });
  }

  static existsDomCoverByClass(cssArr: []) {
    return ClassName.classPathCache.some((cssPath: any) => {
      const regStr = cssArr.join('\\|(.+\\|)*');
      return new RegExp(regStr, 'i').test(cssPath);
    });
  }

  static classIsConflict(cssArr: any, cssPath: any) {
    return (
      ClassName.existsDomCoverByClass(cssArr) ||
      ClassName.existsClassCoverDom(cssPath)
    );
  }

  /**
   * 三联命名规则
   * @param _data
   */
  static threeSegmentsClass(_data: any) {
    const data: any = _data;
    const modelNode: any = ClassName.domCache[data.modelId];
    const parentNode: any = ClassName.domCache[data.parentId];
    const similarParentNode: any = ClassName.domCache[data.similarParentId];
    /**
     * 缓存节点
     * */
    ClassName.domCache[data.id] = data;

    /**
     * 特性命名
     */
    if (data.id) {
      let selfClassName: string = data.tplAttr.class || data.tagName;
      let prevClassName = '';
      let prevPrevClassName = '';

      // 如果模型id为当前id， 即为模型跟节点
      if (data.modelId !== data.id && modelNode) {
        prevClassName = modelNode.selfClassName;
        const grandModelNode = ClassName.domCache[modelNode.modelId];
        const grandParentNode = ClassName.domCache[modelNode.parentId];
        if (modelNode.modelId !== modelNode.id && grandModelNode) {
          prevPrevClassName = grandModelNode.selfClassName;
        } else if (grandParentNode) {
          prevPrevClassName = grandParentNode.selfClassName;
        }
      } else if (parentNode) {
        prevClassName = parentNode.selfClassName;
        const grandParentNode = ClassName.domCache[parentNode.parentId];
        if (grandParentNode) {
          prevPrevClassName = grandParentNode.selfClassName;
        }
      }
      // 构建节点样式链
      const _classPath: string =
        ClassName.getDomClassPath(data) + selfClassName;
      // 构建样式链
      let _selfCssArr = [
        prevPrevClassName,
        prevClassName,
        selfClassName,
      ].filter((s: string) => !!s);

      // 如果该样式名存在冲突，给当前节点样式加后缀
      if (ClassName.classIsConflict(_selfCssArr, _classPath)) {
        selfClassName += `_${ClassName.classIndex}`;
        ClassName.classIndex += 1;
      }
      // 重构样式链
      _selfCssArr = [prevPrevClassName, prevClassName, selfClassName].filter(
        (s: string) => s,
      );
      // 赋值到节点
      data.selfClassName = selfClassName;
      data.selfCss = _selfCssArr;

      // 缓存样式名
      const classPath = ClassName.getDomClassPath(_data);
      ClassName.classPathCache.push(classPath);
      ClassName.classNameCache.push(_selfCssArr);
    }
    /**
     * 相似样式命名
     */
    if (data.similarId) {
      let _selfSimClassName: string = data.tplAttr.class || data.tagName;
      let prevSimClassName = '';
      let _selfSimCssArr: any = [];
      const similarClass: any = ClassName.similarClassCache[data.similarId];

      if (!similarClass) {
        //  如果有父相似节点，且不是相似跟节点
        if (data.similarParentId !== data.id && similarParentNode) {
          prevSimClassName = similarParentNode.similarClassName;
        }
        // 如果没有相似样式命名缓存
        _selfSimCssArr = [prevSimClassName, _selfSimClassName].filter(
          (s: string) => !!s,
        );

        // 构建节点样式链
        const _classPath: string =
          ClassName.getDomClassPath(data) +
          [data.selfClassName, _selfSimClassName].join(':');

        // 判断是否存在重复的样式命名，冲突则加后缀
        if (ClassName.classIsConflict(_selfSimCssArr, _classPath)) {
          _selfSimClassName += `_s${data.similarId}`;
          ClassName.classIndex += 1;
        }
        _selfSimCssArr = [prevSimClassName, _selfSimClassName].filter(
          (s: string) => s,
        );
        ClassName.similarClassCache[data.similarId] = {
          _selfSimClassName,
          _selfSimCssArr,
        };
      } else {
        ({ _selfSimClassName } = similarClass);
        ({ _selfSimCssArr } = similarClass);
      }
      // 复制相似样式名
      data.similarClassName = _selfSimClassName;
      data.similarCssName = _selfSimCssArr;
      // 缓存样式名
      const classPath = ClassName.getDomClassPath(_data);
      ClassName.classPathCache.push(classPath);
      ClassName.classNameCache.push(_selfSimCssArr);
    }
  }

  static twoSegmentsClassWidthId(_data: any) {
    const data: any = _data;
    const modelNode: any = ClassName.domCache[data.modelId];
    const parentNode: any = ClassName.domCache[data.parentId];
    const similarParentNode: any = ClassName.domCache[data.similarParentId];

    // 缓存节点
    ClassName.domCache[data.id] = data;
    /**
     * 特性命名
     */
    const selfClassName: string = `${data.tplAttr.class || data.tagName}_${
      data.serialId
    }`;
    let prevClassName = '';

    // 如果模型id为当前id， 即为模型跟节点
    if (data.modelId !== data.id && modelNode) {
      prevClassName = modelNode.selfClassName;
    } else if (parentNode) {
      prevClassName = parentNode.selfClassName;
    }

    // const selfCssNameStr = [
    //     prevClassName,
    //     selfClassName
    // ].filter((s: string) => !!s).join(' ');
    // 如果存在该样式名
    // if (ClassName.classCache[selfCssNameStr]) {
    // ClassName.classCache[selfCssNameStr] += 1;
    // //selfClassName += ClassName.classCache[selfCssNameStr];
    // selfClassName = selfClassName + data.serialId;
    // }
    const selfCssName = [prevClassName, selfClassName].filter((s: string) => s);
    data.selfClassName = selfClassName;
    data.selfCss = selfCssName;

    /**
     * 相似样式命名
     */

    if (data.similarId) {
      const selfSimClassName: string = `${data.tplAttr.class ||
        data.tagName}_s${data.similarId}`;
      let prevSimClassName = '';

      //  如果有父相似节点，且不是相似跟节点
      if (data.similarParentId !== data.id && similarParentNode) {
        prevSimClassName = similarParentNode.similarClassName;
      }

      // const selfSimCssNameStr = [
      // prevSimClassName,
      //  selfSimClassName
      // ].filter((s: string) => !!s).join(' ');
      // 如果存在该样式名
      // if (ClassName.classCache[selfSimCssNameStr]) {
      //     ClassName.classCache[selfSimCssNameStr] += 1;
      //     selfClassName += ClassName.classCache[selfSimCssNameStr];
      // }
      const selfSimCssName: any[] = [prevSimClassName, selfSimClassName].filter(
        (s: string) => s,
      );
      data.similarClassName = selfSimClassName;
      data.similarCssName = selfSimCssName;
    }

    // 缓存样式名
    ClassName.classCache[selfCssName.join(' ')] = 1;
  }

  /**
   * Bem规则命名
   * @param _data
   */
  static BemClass(_data: any) {
    const data: any = _data;

    try {
      /**
       * 特性节点命名
       */
      let selfPrefix = '';
      const modelNode = ClassName.domCache[data.modelId];
      const parentNode = ClassName.domCache[data.parentId];
      let selfClassName = data.tplAttr.class || data.tagName;

      // 如果模型id为当前id， 即为模型跟节点， 不使用模型样式链模式
      if (data.modelId !== data.id && modelNode) {
        selfPrefix = modelNode.selfClassName;

        selfClassName = `${modelNode.tplAttr.class}-${selfClassName}`;
        const className = [selfPrefix, selfClassName].join(' ');
        selfClassName = ClassName.classCache[className]
          ? selfClassName + data.serialId
          : selfClassName;
        data.selfClassName = selfClassName;
        data.selfCss = [selfPrefix, selfClassName];
      } else if (parentNode) {
        // 如果有父节点，则使用父节点样式链模式
        selfPrefix = parentNode.selfClassName;

        if (ClassName.domCache[parentNode.parentId]) {
          selfClassName = `${parentNode.tplAttr.class}-${selfClassName}`;
        }

        const className = [selfPrefix, selfClassName].join(' ');
        // 如果存在样式，则加后缀
        selfClassName = ClassName.classCache[className]
          ? selfClassName + data.serialId
          : selfClassName;
        data.selfClassName = selfClassName;
        data.selfCss = [selfPrefix, selfClassName];
      } else if (!parentNode) {
        // 如果没有副节点（说明当前节点为结构跟节点），则使用自身样式名
        data.selfClassName = selfClassName;
        data.selfCss = [selfClassName];
      } else {
        // 否则，使用自身样式名+序列值（序列值是树的唯一值）
        data.selfClassName = selfClassName + data.serialId;
        data.selfCss = [selfClassName + data.serialId];
      }

      // 缓存样式链
      ClassName.classCache[data.selfCss.join(' ')] = true;

      /**
       * 相似节点命名
       */
      if (ClassName.similarClassCache[data.similarId]) {
        // 如果相似节点已经有缓存样式链，直接使用该样式链
        const similarClass = ClassName.similarClassCache[data.similarId];
        data.similarClassName = similarClass.similarClassName;
        data.similarCssName = similarClass.similarCssName;
      } else if (data.similarId) {
        // 如果有相似节点
        let similarPrefix = '';
        const similarParent = ClassName.domCache[data.similarParentId];

        let similarClassName = ['_', data.tplAttr.class || data.tagName].join(
          '',
        );

        if (similarParent) {
          // 如果有similarParent，即该相似节点为某相似节点的子节点，使用相似节点样式链
          similarPrefix = similarParent.similarClassName;

          similarClassName = [
            similarParent.tplAttr.class,
            ' _',
            similarClassName,
          ].join(' ');
          const className = [similarPrefix, similarClassName].join(' ');
          similarClassName = ClassName.classCache[className]
            ? similarClassName + data.similarId
            : similarClassName;
          data.similarClassName = similarClassName;
          data.similarCssName = [similarPrefix, similarClassName];
        } else {
          // 否则为相似节点跟节点，使用当前跟节点样式名+相似值（相似列唯一值）
          data.similarClassName = similarClassName + data.similarId;
          data.similarCssName = [similarClassName + data.similarId];
        }

        ClassName.similarClassCache[data.similarId] = {
          similarClassName: data.similarClassName,
          similarCssName: data.similarCssName,
        };
        ClassName.classCache[data.similarCssName.join(' ')] = true;
      }

      // 缓存节点
      ClassName.domCache[data.id] = data;
    } catch (e) {
      Loger.error(
        `class_name.js [process] ${e}, params:[data.id:${data && data.id}]`,
      );
    }
  }

  static process(_data: any, _func: any) {
    ClassName.classIndex = 0;

    ClassName.domCache = {};
    ClassName.classCache = {};

    ClassName.classPathCache = [];
    ClassName.classNameCache = [];

    ClassName.similarClassCache = {};

    ClassName.goIn(_data, _func);
  }

  static goIn(_data: any, _func: any) {
    _func(_data);

    // 遍历下一层
    _data.children.forEach((d: any) => {
      ClassName.goIn(d, _func);
    });
  }
}

export default ClassName;
