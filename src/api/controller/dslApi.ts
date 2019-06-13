import { Context } from 'koa';
import dslService from '../../core/dsl_service_ts/dslService';
// import dslProcess from '../../core/dsl_service_ts/process';

export default async function process(context: Context) {
  const { designJSON, options } = context.request.body;
  const dslValue = dslService.process(
    {
      nodes: designJSON,
    },
    options || {},
  );
  const res = context.response;
  res.body = dslValue;
}
