import log4js from 'log4js';
import path from 'path';
import request from 'request';
import Store from '../helper/store';

const emptyArray: any = [];
const isSendMessage = true;
const serverUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send';
const serverKey = '530aca1a-88b4-4a97-aa8b-ace476b9216c';
const moduleData = {
  img: {
    name: '图片合成模块',
    author: ['yixionglin'],
    key: '2b2a686b-2ad7-489e-8ccf-51641e3e260e',
  },
  platform: {
    name: '平台模块',
    author: ['alltasxiao'],
    key: '530aca1a-88b4-4a97-aa8b-ace476b9216c',
  },
  dsl: {
    name: 'dsl模块',
    author: ['chironyang'],
    key: '413f97f9-c7f2-4268-b4f5-9b518543daa6',
  },
  json: {
    name: 'designJson模块',
    author: ['yonechen'],
    key: 'ddae2f6b-530f-4d90-a622-6894b01eb5dc',
  },
  render: {
    name: 'render模块',
    author: ['chironyang'],
    key: 'ddae2f6b-530f-4d90-a622-6894b01eb5dc',
  },
  all: {
    name: 'all',
    author: emptyArray,
    key: 'db5b5c80-a6e1-4089-a102-af29b0807c0a',
  },
};
log4js.configure({
  appenders: {
    out: {
      type: 'console',
    },
    dateFile: {
      type: 'dateFile',
      filename: path.join(__dirname, 'logs.log'),
      pattern: '.yyyy-MM-dd',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %c %m%n',
      },
    },
    productionFile: {
      type: 'dateFile',
      filename: path.join(__dirname, 'production.log'),
      pattern: '.yyyy-MM-dd',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %m%n',
      },
    },
  },
  categories: {
    default: {
      appenders: ['out', 'dateFile'],
      level: 'debug',
    },
    production: {
      appenders: ['productionFile'],
      level: 'warn',
    },
  },
});

const defaultLogger = log4js.getLogger();
const productionLogger = log4js.getLogger('production');

// const logger = log4js.getLogger('cheese');
// logger.level = 'debug';
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Comté.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

function clone(_obj: any, _destObj: any) {
  const obj: any = _obj;
  const destObj: any = _destObj;
  if (typeof obj !== 'object') {
    return obj;
  }
  // for (const i in obj) {
  Object.keys(obj).forEach((i: any) => {
    destObj[i] = typeof obj[i] === 'object' ? clone(obj[i], undefined) : obj[i];
  });

  return destObj;
}

function pushMessage(param: any) {
  if (!isSendMessage) {
    return;
  }
  const options = {
    method: 'POST',
    url: serverUrl,
    qs: {
      key: param.key,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      msgtype: 'text',
      text: {
        content: param.content,
        mentioned_list: [param.author], // eslint-disable-line
      },
    },
    json: true,
  };

  request(serverUrl, options, (error: any, response: any, body: any) => {
    // if (error) throw new Error(error);
    // console.log(body);
  });
}

function pushMessageToAll(_param: any) {
  const param: any = _param;
  param.key = moduleData.all.key;
  pushMessage(param);
}

const initOption = {
  projectName: '',
  url: '',
};

function getLogMessage(projectName: any, name: any, str: any, userName: any) {
  return `${projectName} ${name} ${str} 上传者：${userName}`;
}

function getPushMessageContent(
  projectName: any,
  name: any,
  str: any,
  url: any,
  userName: any,
) {
  return `${projectName} ${name}\n${str}\n报错设计稿地址：${url}\n上传者：${userName}`;
}

class Qlogger {
  option: any;

  debug: (str: any) => void;

  info: (str: any) => void;

  warn: (str: any) => void;

  error: (str: any) => void;

  fatal: (str: any) => void;
  getProjectInfo: () => any;
  pushMessageToAll: (str: any) => void;

  constructor(param: any) {
    this.option = {};
    this.option.name = param.name || '';
    this.option.author = param.author || '';
    this.debug = function(str: any) {
      const option = this.getProjectInfo();
      defaultLogger.debug(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      productionLogger.debug(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
    };
    this.info = function(str: any) {
      const option = this.getProjectInfo();
      defaultLogger.info(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      productionLogger.info(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
    };
    this.warn = function(str: any) {
      defaultLogger.warn(
        getLogMessage(
          this.option.projectName,
          this.option.name,
          str,
          this.option.userName,
        ),
      );
      productionLogger.warn(
        getLogMessage(
          this.option.projectName,
          this.option.name,
          str,
          this.option.userName,
        ),
      );
      pushMessage({
        content: getPushMessageContent(
          this.option.projectName,
          this.option.name,
          str,
          this.option.url,
          this.option.userName,
        ),
        author: this.option.author,
        key: this.option.key,
      });
    };
    this.error = function(str: any) {
      const option = this.getProjectInfo();
      defaultLogger.error(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      productionLogger.error(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      pushMessage({
        content: getPushMessageContent(
          option.projectName,
          option.name,
          str,
          option.url,
          option.userName,
        ),
        author: option.author,
        key: option.key,
      });
      pushMessageToAll({
        content: getPushMessageContent(
          option.projectName,
          option.name,
          str,
          option.url,
          option.userName,
        ),
        author: option.author,
      });
    };
    this.fatal = function(str: any) {
      const option = this.getProjectInfo();
      defaultLogger.fatal(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      productionLogger.fatal(
        getLogMessage(option.projectName, option.name, str, option.userName),
      );
      pushMessage({
        content: getPushMessageContent(
          option.projectName,
          option.name,
          str,
          option.url,
          option.userName,
        ),
        author: option.author,
        key: option.key,
      });
      pushMessageToAll({
        content: getPushMessageContent(
          option.projectName,
          option.name,
          str,
          option.url,
          option.userName,
        ),
        author: option.author,
      });
    };
    this.pushMessageToAll = function(str: any) {
      const option = this.getProjectInfo();
      pushMessageToAll({
        content: getPushMessageContent(
          option.projectName,
          option.name,
          str,
          option.url,
          option.userName,
        ),
        author: option.author,
      });
    };
    this.getProjectInfo = function() {
      return {
        userName: Store.get('applyInfo_user'),
        url: Store.get('applyInfo_url'),
        projectName: Store.get('applyInfo_proName'),
        author: this.option.author,
        name: this.option.name,
      };
    };
  }
}

export default {
  getInstance(param: any) {
    const q: any = new Qlogger(param);
    return q;
  },
  init(param: any) {
    clone(param, initOption);
  },
  moduleData,
};
