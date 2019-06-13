import { Context } from 'koa';
import qlog from '../../../core/log/qlog';
import store from '../../../core/designimage/helper/store';
function storeLoginData(context: Context) {
  const { request } = context;
  let { sketchPath, imgList, options } = request.body;
  let {
    applyInfo_user: userName,
    applyInfo_url: url,
    applyInfo_proName: projectName,
  } = options;
  var imgData = qlog.moduleData.img;
  var logOption = {
    userName: userName,
    url: url,
    projectName: projectName,
    name: imgData.name,
    author: imgData.author,
    key: imgData.key,
  };
  store.assign(logOption);
  return logOption;
}

export default {
  storeLoginData: storeLoginData,
};
