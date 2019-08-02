import { Context } from 'koa';
import dslService from '../../core/dsl_service_ts/dslService';
// import dslProcess from '../../core/dsl_service_ts/process';

export default async function process(context: Context) {
  const { designJSON, renderData, options } = context.request.body;
  const input = {
    nodes: designJSON,
    renderData: renderData,
  };
  const res: any = {
    state: 1,
    msg: '',
    data: null,
  };
  try {
    const opt = Object.assign(
      {
        outputType: 'h5',
        optimizeHeight: 750,
        showTagAttrInfo: false,
        isLocalTest: false,
      },
      options,
    );
    const data = dslService.process(input, opt);
    if (data) {
      res.data = data;
    } else {
      res.state = 0;
      res.msg = 'no data';
    }
  } catch (e) {
    res.state = 0;
    res.msg = e;
  }
  context.response.body = res;
}
