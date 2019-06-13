import { Context } from 'koa';

export default async function testPostApi(context: Context) {
  const ctx = context;
  const postData = ctx.request.body;
  console.log(ctx.request);
  console.log(ctx.request.body);
  ctx.body = postData;
}
