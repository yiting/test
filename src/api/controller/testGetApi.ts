import { Context } from 'koa';

export default async function testGetApi(context: Context) {
  const ctx = context;
  const html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/posTest">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `;
  ctx.body = html;
}
