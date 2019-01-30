const log4js = require('log4js');
const request = require('request');
const isSendMessage = false;
const serverUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send';
const serverKey = '530aca1a-88b4-4a97-aa8b-ace476b9216c';
const moduleData = {
    "img": {
        "name": "图片合成模块",
        "author": ["yixionglin"],
        "key": "2b2a686b-2ad7-489e-8ccf-51641e3e260e"
    },
    "platform": {
        "name": "平台模块",
        "author": ["alltasxiao"],
        "key": "530aca1a-88b4-4a97-aa8b-ace476b9216c"
    },
    "dsl": {
        "name": "dsl模块",
        "author": ["chironyang"],
        "key": "413f97f9-c7f2-4268-b4f5-9b518543daa6"
    },
    "render": {
        "name": "render模块",
        "author": ["chironyang"],
        "key": "35339dc8-a982-4227-9b31-4e8b39202374"
    },
    "json": {
        "name": "designJson模块",
        "author": ["yonechen"],
        "key": "ddae2f6b-530f-4d90-a622-6894b01eb5dc"
    },
    "all": {
        "name": "all",
        "author": [],
        "key": "db5b5c80-a6e1-4089-a102-af29b0807c0a"
    }
}
log4js.configure({
    appenders: {
        out: {
            type: 'console'
        },
        dateFile: {
            type: 'dateFile',
            filename: 'log/logs.log',
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %c %m%n'
            }
        },
        productionFile: {
            type: 'dateFile',
            filename: 'log/production.log',
            pattern: '.yyyy-MM-dd',
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %m%n'
            }
        }
    },
    categories: {
        default: {
            appenders: ['out', 'dateFile'],
            level: 'debug'
        },
        production: {
            appenders: ['productionFile'],
            level: 'warn'
        }
    }
});

var defaultLogger = log4js.getLogger();
var productionLogger = log4js.getLogger("production");

// const logger = log4js.getLogger('cheese');
// logger.level = 'debug';
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Comté.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

function clone(obj, destObj) {
    if (typeof obj !== "object") {
        return obj;
    } else {
        for (var i in obj) {
            destObj[i] = typeof obj[i] === "object" ? clone(obj[i]) : obj[i];
        }
    }
    return destObj;
}

function pushMessage(param) {
    if (!isSendMessage) {
        return;
    }
    var options = {
        method: 'POST',
        url: serverUrl,
        qs: {
            key: param.key
        },
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            msgtype: 'text',
            text: {
                content: param.content,
                mentioned_list: [param.author]
            }
        },
        json: true
    };

    request(options, function (error, response, body) {
        // if (error) throw new Error(error);
        // console.log(body);
    });

}

function pushMessageToAll(param) {
    param.key = moduleData.all.key;
    pushMessage(param);
}

var initOption = {
    "projectName": "",
    "url": ""
}

function getLogMessage(projectName, name, str, userName) {
    return projectName + " " + name + " " + str + " 上传者：" + userName;
}

function getPushMessageContent(projectName, name, str, url, userName) {
    return projectName + " " + name + "\n" + str + "\n地址：" + url + "\n上传者：" + userName + "\n责任人："
}

var qlogger = function (param) {
    this.option = param || {};
    clone(initOption, this.option);
    this.option.name = param.name || "";
    this.option.userName = param.userName || "";
    this.debug = function (str) {
        defaultLogger.debug(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        productionLogger.debug(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
    }
    this.info = function (str) {
        defaultLogger.info(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        productionLogger.info(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
    }
    this.warn = function (str) {
        defaultLogger.warn(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        productionLogger.warn(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        pushMessage({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author,
            "key": this.option.key
        });
    }
    this.error = function (str) {
        defaultLogger.error(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        productionLogger.error(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        pushMessage({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author,
            "key": this.option.key
        });
        pushMessageToAll({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author
        });
    }
    this.fatal = function (str) {
        defaultLogger.fatal(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        productionLogger.fatal(getLogMessage(this.option.projectName, this.option.name, str, this.option.userName));
        pushMessage({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author,
            "key": this.option.key
        });
        pushMessageToAll({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author
        });
    }
    this.pushMessageToAll = function (str) {
        pushMessageToAll({
            "content": getPushMessageContent(this.option.projectName, this.option.name, str, this.option.url, this.option.userName),
            "author": this.option.author
        });
    }
}

module.exports = {
    getInstance: function (param) {
        return new qlogger(param);
    },
    init: function (param) {
        clone(param, initOption)
    },
    moduleData: moduleData
}
