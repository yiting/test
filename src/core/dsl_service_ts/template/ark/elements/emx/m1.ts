import ArkTemplate from '../../arkTemplate';

class EMXM1 extends ArkTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
        <View size="${this.width},${
      this.height
    }" @constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <tag $each $useTag></tag>
        </View>`;
  }
}

export default EMXM1;
