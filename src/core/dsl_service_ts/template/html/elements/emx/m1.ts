import HtmlTemplate from '../../htmlTemplate';

class EMXM1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
        <div class="inline" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <tag $each $useTag></tag>
        </div>`;
  }
}

export default EMXM1;
