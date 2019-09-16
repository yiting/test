const version = {
  img: '2.0.21',
  dsl: '1.0.67',
  json: '1.0.2',
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

function getVersionV2(type: string) {
  var result = this.getVersion(type);
  return {
    state: 1,
    data: result,
    msg: '',
  };
}

export default {
  getVersion: getVersion,
  getVersionV2: getVersionV2,
};
