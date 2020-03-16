import { Context } from 'koa';
import dslService from '../../core/dsl_service/dslService';
// import dslProcess from '../../core/dsl_service_ts/process';

export default async function process(context: Context) {
  const { designJSON, renderData, options } = context.request.body;
  const input = {
    nodes: designJSON,
    renderData: renderData,
  };
  const opt = Object.assign(
    {
      outputType: 'ark',
      optimizeHeight: 750,
      showTagAttrInfo: false,
      isLocalTest: false,
    },
    options,
  );
  const dslValue = dslService.process(input, opt);
  const res = context.response;
  res.body = dslValue;
}
