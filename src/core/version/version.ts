const version = {
  img: '2.0.16',
  dsl: '1.0.27',
  json: '1.0.1',
};
//test
function getVersion(type: string) {
  var result = {
    type: '',
    version: '',
  };
  if (type == 'img') {
    result.version = version['img'];
    result.type = type;
    return result;
  }
  if (type == 'dsl') {
    result.version = version['dsl'];
    result.type = type;
    return result;
  }
  if (type == 'json') {
    result.version = version['json'];
    result.type = type;
    return result;
  }
  if (type == '') {
    return version;
  }
  return result;
}

export default {
  getVersion: getVersion,
};
