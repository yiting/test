import HtmlTemplate from '../htmlTemplate';

class Inline extends HtmlTemplate {
  constructor(...args: any[]) {
    super(...args);
    this._template = `
        <div class="inline" @constraints='{
            "LayoutDirection":"Horizontal",
            "LayoutJustifyContent":"Start"
          }'>
            <tag $each $useTag></tag>
        </div>`;
  }
}

export default Inline;
