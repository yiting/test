import HtmlTemplate from '../../htmlTemplate';

class EMXM1 extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
        <div class="inline" :constraints='{"LayoutDirection":"Horizontal","LayoutJustifyContent":"Start"}'>
            <span $each $useTag></span>
        </div>`;
  }
}

export default EMXM1;
