import { Context } from 'koa';

const request = require('request');

export async function testDownload(context: Context) {
  const ctx = context;
  const html = ` testDownload `;
  const url = `${context.origin}/img_downloadSketch`;

  request.post(
    {
      url,
      form: {
        param: {
          url: 'http://10.64.70.72:8074/test/1.sketch',
        },
      },
    },
    function(
      error: Record<string, any>,
      response: any,
      body: Record<string, any>,
    ) {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(response.body);
        console.log(result);
      }
    },
  );
  ctx.body = html;
}

export async function testMakeImg(context: Context) {
  const ctx = context;
  const html = ` testMakeImg `;

  const url = `${context.origin}/img_makeImg`;
  request.post(
    {
      url,
      form: {
        param: {
          do_objectID: '70FC12F1-1AC7-4A0E-9E5E-EBBA26988209',
          projectName: '0list',
          generateId: 'img24',
          path: '70FC12F1-1AC7-4A0E-9E5E-EBBA26988209.png',
        },
      },
    },
    function(
      error: Record<string, any>,
      response: any,
      body: Record<string, any>,
    ) {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(response.body);
        console.log(result);
      }
    },
  );
  ctx.body = html;
}

export async function makeImgByUpdateSketch(context: Context) {
  const ctx = context;
  const html = ` makeImgByUpdateSketch `;

  const url = `${context.origin}/img_makeImgByUpdateSketch`;
  request.post(
    {
      url,
      form: {
        param: {
          generateId: 'img1',
          path: '_F21D_4A7A_5E85.png',
          projectName: '1单页的副本',
          imageChildren: [
            {
              _origin: {
                do_objectID: 'F21D55C5-D80B-4483-9AC8-DD73CBA6382F',
              },
              levelArr: [0, 1, 0],
            },
            {
              _origin: {
                do_objectID: '4A7AA944-CCE6-45AF-808F-C3EBE2F2099A',
              },
              levelArr: [0, 1, 1],
            },
            {
              _origin: {
                do_objectID: '5E85DCCA-B103-42DB-8071-71F122DDF80E',
              },
              levelArr: [0, 1, 5],
            },
          ],
        },
      },
    },
    function(
      error: Record<string, any>,
      response: any,
      body: Record<string, any>,
    ) {
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(response.body);
        console.log(result);
      }
    },
  );
  ctx.body = html;
}
