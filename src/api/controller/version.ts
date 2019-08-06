import { Context } from 'koa';
import version from '../../core/version/version';

export function getVersion(context: Context) {
  const { request } = context;
  let type = request.body.type;
  let result = version.getVersion(type);
  context.body = result;
}

export function getVersionV2(context: Context) {
  const { request } = context;
  let type = request.body.type;
  let result = version.getVersionV2(type);
  context.body = result;
}
