import fs from 'fs';
import path from 'path';
import documentJson from './data/document.json';
import metaJson from './data/meta.json';
import pageJson from './data/pages/E23F15A7-DB15-4E5C-AA29-E5746309414C.json';
import expectNodesJson from './data/expect.nodes.json';
import expectImagesJson from './data/expect.images.json';

import DesignJSON from '../../src/core/designjson';

test('parse正确性测试', () => {
  DesignJSON.init('sketch', {
    pages: [pageJson],
    documentJson,
    filePath: metaJson.appVersion,
  });
  const result = DesignJSON.parse(pageJson.layers[0].do_objectID);
  // fs.writeFileSync(
  //   path.resolve(__dirname, './data/expect.nodes.json'),
  //   JSON.stringify(result.nodes),
  // );
  expect(result.nodes).toEqual(expectNodesJson);
  // 去除自循环引用
  const images = result.images.map((item: any) => {
    const newItem = { ...item };
    delete newItem._origin;
    delete newItem._imageChildren;
    return newItem;
  });
  expect(images).toEqual(expectImagesJson);
});
