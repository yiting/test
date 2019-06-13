import { Context } from 'koa';

const request = require('request');

export async function testImgCombine(context: Context) {
  const ctx = context;
  const html = ` testImgCombine `;

  const url = `${context.origin}/img_combine`;
  request.post(
    {
      url,
      form: {
        param: {
          generateId: 'img1',
          projectName: '1单页的副本',
          node: {
            _origin: {
              _class: '',
              do_objectID: '',
            },
            id: '_F21D_4A7A_5E85',
            path: '_F21D_4A7A_5E85.png',
            _imageChildren: [
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

export async function testImgCombineSimple(context: Context) {
  const ctx = context;
  const html = ` testImgCombine `;

  const url = `${context.origin}/img_combine`;
  request.post(
    {
      url,
      form: {
        param: {
          generateId: 'img2',
          projectName: '1单页的副本',
          node: {
            _origin: {
              _class: 'shapeGroup',
              do_objectID: 'E0BE3B13-7774-4B9E-84BA-845F1A64C7FD',
            },
            id: 'E0BE3B13-7774-4B9E-84BA-845F1A64C7FD',
            path: 'E0BE3B13-7774-4B9E-84BA-845F1A64C7FD.png',
            _imageChildren: [],
          },
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

export async function testImgGenerate(context: Context) {
  const ctx = context;
  const html = ` test img generate `;

  const url = `${context.origin}/img_generate`;
  request.post(
    {
      url,
      form: {
        sketchPath: 'http://10.64.70.72:8074/test/1.sketch',
        imgList: [
          {
            id: '_F21D_4A7A_5E85',
            path: '111.png',
            _imageChildren: [
              {
                id: 'F21D55C5-D80B-4483-9AC8-DD73CBA6382F',
                levelArr: [0, 1, 0],
              },
              {
                id: '4A7AA944-CCE6-45AF-808F-C3EBE2F2099A',
                levelArr: [0, 1, 1],
              },
              {
                id: '5E85DCCA-B103-42DB-8071-71F122DDF80E',
                levelArr: [0, 1, 5],
              },
            ],
          },
          {
            id: '_F21D_4A7A_5E85',
            path: '222.png',
            _imageChildren: [
              {
                id: 'F21D55C5-D80B-4483-9AC8-DD73CBA6382F',
                levelArr: [0, 1, 0],
              },
              {
                id: '4A7AA944-CCE6-45AF-808F-C3EBE2F2099A',
                levelArr: [0, 1, 1],
              },
              {
                id: '5E85DCCA-B103-42DB-8071-71F122DDF80E',
                levelArr: [0, 1, 5],
              },
            ],
          },
        ],
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
