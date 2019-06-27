import { Context } from 'koa';
import dslService from '../../core/dsl_service_ts/dslService';
// import dslProcess from '../../core/dsl_service_ts/process';

export default async function process(context: Context) {
  const { designJSON, renderData, options } = context.request.body;
  const dslValue = dslService.process(
    {
      nodes: designJSON,
      renderData: renderData,
    },
    options || {},
  );
  const res = context.response;
  res.body = dslValue;
}
