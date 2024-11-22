# 视觉编译

让机器理解设计稿（SKETCH、PSD ），并生成对应的 UI 样式及结构代码(H5、iOS、Android)

## 目录

1. 解决什么问题
2. 解决方案
3. 任务列表
4. 快速搭建环境
5. 目录结构
6. 相关链接
7. 许可声明/交流群

## 1.解决什么问题

- 程序依照设计稿生成 ui 界面代码（支持多种语言）。
- 减少视觉设计师与开发联合走查设计还原的工作量。
- 生成页面直接供前台使用，减少 ui 还原的环节。

## 2.解决方案

待补充

## 3.快速搭建环境 【有兴趣加入的同学，我们会安排专人帮你搭建运行环境】

```
背景：由于视觉编译服务底层绘图模块使用了sketch和gm运行库，而sketch绘图库目前只能在mac电脑下运行(后续可研究是否可反编译，运行在其他平台)，因此该项目主要部署mac电脑,
部分鉴权服务部署在linux服务器。linux服务器上主要用于获取鉴权信息(公司鉴权信息端口受限，只能80端口，而mac上80端口被系统服务占用，所以采用linux服务器鉴权，获取到鉴权
用户信息后给到mac主服务)，mac服务器拿到鉴权信息完成剩下的整个编译操作。
```

1. 安装绘图环境

- sketch：负责绘图
  - 在 mac 电脑上安装 sketch 软件，鼠标右键显示包内容，将该软件包拷贝在项目/server_modules/designimage 下面
- gm：负责合图
  - 安装 imageMagick 底层绘图软件：`brew install imagemagick && brew install graphicsmagick`
  - 安装 node 桥接包(https://www.npmjs.com/package/gm)：`npm install gm && npm install gm-base64`

2. 下载项目代码

- 下载项目代码到本地电脑

1. 初始化数据库

- 安装 mysql 数据库（建议版本 Server version: 8.0.13 MySQL Community Server - GPL）
- 初始化数据库命令，如: `source /code/sql/tosee.sql`

4. 启动服务

- 跳转到对应项目代码的路径，如：`cd /Users/code`
- 启动命令：`npm run start或pm2 start ./bin/www`

5. 访问页面(由于使用了 url 地址透传，按钮、链接等不能直接跳转，根据路径访问对应页面)

```
说明：由于鉴权信息在线上服务器进行，本地部署无法获取用户信息。在本地部署时，先登录官网，获取的用户信息存储在浏览器cookie中。这样本地部署访问时，
即可根据用户信息进行一系列数据库持久化操作。
```

- 主页：localhost:8080
- 个人中心：localhost:8080/person
- 编译结果页(需要复制上传后的项目链接，更改为本机地址+端口)，如：localhost:8080/edit?id=9b288f20-30f8-11e9-8839-1f15855e680f&name=20190215160632_0list

## 4.目录结构

#### `提示：下面项目目录，以上述新的仓库目录结构为准`

```
├── bin
│     └── www
├── controllers            # 控制器
│     ├── edit
│     │    └── edit.js     # 结果页面操作类
│     ├── util
│     │    └── util.js     # 后台工具类
│     ├── description.js   # 设计规范
│     ├── materail.js      # 素材管理(规划中)
│     ├── person.js        # 个人中心
│     ├── project.js       # 项目类
│     ├── user.js          # 用户类
│     └── visitor.js       # 访客类
├── data                   # 存放核心数据文件
│      ├── complie         # 存放编译结果项目
│      ├── download_file   # 存放下载编译项目文件
│      ├── upzip_file      # 存放上传解压文件
│      └── upload_file     # 存放上传文件
├── log                    # 存放用户操作日志(2种格式文件：开发者环境日志-logs.log、生产环境-production.log)
├── models #模型类
│      ├── artboard.js     # 单个artboard页面数据类
│      ├── database.js     # 数据库配置信息类
│      ├── history.js      # 访问历史记录类
│      └── upload_file     # 项目工程类
├── node_modules           # 服务运行所需包
├── public                 # 公共资源文件夹
│      ├── css
│      │   ├── _global
│      │   ├── edit
│      │   ├── error
│      │   ├── index
│      │   ├── lib
│      │   ├── material
│      │   ├── tips
│      │   └── visitor
│      ├── icons
│      ├── font
│      ├── icons
│      ├── img
│      ├── icons
│      ├── js
│      ├── resource
│      ├── theme
│      ├── video
│      └── layer.js
├── routes                # 页面路由
│     ├── description.js  # 设计规范
│     ├── edit.js         # 结果页面操作
│     ├── index.js        # 首页
│     ├── materail.js     # 素材管理(规划中)
│     ├── person.js       # 个人中心
│     ├── project.js      # 项目管理
│     └── visitor.js      # 访客
├── server_modules        # 基础服务模块:具体可查看对应模块的相关API文档
│     ├── designimage     # 绘图模块
│     │     ├── Contents  # sketch运行库包(此处必须搭载sketch软件包)
│     │     └── ...
│     ├── designjson      # 图元处理模块
│     ├── dsl             # DSL模块(old)--(包含中间层转换和目标语言翻译)
│     ├── dsl2            # DSL模块(new)(将原始数据转换为中间转换层数据)
│     ├── render          # 渲染翻译模块(将中间转换层数据翻译为目标语言)
│     ├── template        # 模板模块(存放各平台各种模板)
│     ├── util            # 基础服务工具文件夹
│     ├── skCommon.js     # 测试：获取文件原始数据使用
│     └── version.js      # 基础服务模块版本控制(版本更新后，平台之前编译项目按照最新模块重新编译:待接入)
├── sql                   # 项目数据库表
├── views                 # 页面视图
│     ├── template        # 各页面公共模板
│     ├── description.ejs # 设计规范页面
│     ├── edit.ejs        # 结果操作页面
│     ├── error.ejs       # 服务错误页面
│     ├── index.ejs       # 首页
│     ├── material.ejs    # 素材管理页面 (规划中)
│     ├── person.ejs      # 个人中心页面
│     ├── projects.ejs    # 所有项目页面
│     ├── start.ejs       # 鉴权服务页面(部署在linux服务器上，用于鉴权，鉴权信息传递给mac主服务)
│     ├── tips.ejs        # 提示页面(如404错误)
│     └── visitor.ejs     # 访客页面
├── app.js                # 服务配置总入口
├── package-lock.json
└── package.json
```

## 5.相关链接

待补充

## 6.许可声明/交流群

#### 注意：项目仅供公司内部开源，源代码未经授权，禁止对外公开

### 项目相关代码仅对内部交流，请勿外传！谢谢！
