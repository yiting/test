const version = {
  img: '2.0.2',
  dsl: '1.0.1',
  json: '1.0.1',
};

function getVersion(type: string) {
  var result = {
    type: '',
    version: '',
  };
  if (type == 'img') {
    result.version = version['img'];
  }
  if (type == 'dsl') {
    result.version = version['dsl'];
  }
  if (type == 'json') {
    result.version = version['json'];
  }
  result.type = type;
  return result;
}

export default {
  getVersion: getVersion,
};
