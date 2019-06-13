import { Context } from 'koa';
import version from '../../core/version/version';

export function getVersion(context: Context) {
  const { request } = context;
  let type = request.body.type;
  let result = version.getVersion(type);
  context.body = result;
}
