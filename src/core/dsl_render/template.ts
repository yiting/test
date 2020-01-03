import QLog from '../dsl_layout/helper/qlog';
const Loger = QLog.getInstance(QLog.moduleData.render);

class Template {
  dom: any;

  constructor(dom: any) {
    this.dom = dom;
  }
  get slot() {
    return (
      this.dom.children &&
      this.dom.children
        .map((d: any) => {
          return Template.getUI(d.template);
        })
        .join('')
    );
  }

  getUI() {
    return '';
  }

  static getUI(template: any) {
    return template.getUI();
  }
}

export default Template;
