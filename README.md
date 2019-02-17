# 视觉编译
通过算法把设计稿翻译为计算机语言，实现UI界面还原
官网：http://uitocode.oa.com/

## 目录
1. 解决什么问题
2. 解决方案
3. 任务列表（工作分担，及对应例子）
4. 快速搭建环境
5. 目录结构
6. 相关文章/辅助工具
7. 许可声明/交流群

## 1.解决什么问题
- 程序依照设计稿生成ui界面代码（支持多种语言）。
- 减少视觉设计师与开发联合走查设计还原的工作量。
- 生成页面直接供前台使用，减少ui还原的环节。

## 2.解决方案
![](http://km.oa.com/files/photos/pictures/201901/1547005473_87_w966_h636.png)

## 3.任务列表
- [ ] DSL语言设计
  - [x] 提供组件绑定能力，A设计组件，绑定A或A相关代码片段。 
  - [x] 结构或样式去重处理，减少重复代码。 
  - [x] 生成流式布局页面，方面内容扩展。 
- [ ] DesignJson：将视觉稿图层抽象为图元树。http://mrw.so/57KPAJ
  - [x] Parser图元抽象-Sketch
  - [ ] Parser图元抽象-Photoshop
  - [ ] Parser图元抽象-XD
  - [x] Optimize图元优化
- [ ] AI页面元素识别
  - [ ] 识别页面元素，为合图及页面结构提供合并的判断条件。 
  - [ ] 识别元素接口开放，返回查询字段。 
- [ ] 图像合成/绘图去重
  - [ ] 重复图片，去重处理  
  - [ ] psd 
  - [ ] sketch
  - [ ] xd
- [ ] 图元处理
  - [ ]不需要任何人工参与，程序根据设计稿，自动切图。 
- [ ] 平台
  - [x] 上传、解析、编译、下载、预览。 
  - [x] 关键数据存储(上传文件、解压数据、编译项目、下载项目)；操作记录日志。
  - [x] 个人中心(个人项目、浏览项目)、访客统计、所有项目、开发者工具、设计规范。 
  - [x] 编译页资源提取、面板操作(测距、单位转换等)。 
  - [ ] 底层基础库版本比对定时任务待接入
  - [ ] AI+普通规则待接入


## 4.快速搭建环境

#### &nbsp;&nbsp;&nbsp;&nbsp;背景：由于视觉编译服务底层绘图模块使用了sketch和gm运行库，而sketch绘图库目前只能在mac电脑下运行(后续可研究是否可反编译，运行在其他平台)，因此该项目主要部署mac电脑,部分鉴权服务部署在linux服务器。linux服务器上主要用于获取鉴权信息(公司鉴权信息端口受限，只能80端口，而mac上80端口被系统服务占用，所以采用linux服务器鉴权，获取到鉴权用户信息后给到mac主服务)，mac服务器拿到鉴权信息完成剩下的整个编译操作。

  1. 安装绘图环境
   -  sketch：负责绘图 
      - 在mac电脑上安装sketch软件，且获取当前软件包，将该软件包存放在基础模块-designimage下面
   -  gm：负责合图
      - 安装imageMagick底层绘图软件：`brew install imagemagick && brew install graphicsmagick`
      - 安装node桥接包(https://www.npmjs.com/package/gm)：`npm install gm && npm install gm-base64`
  2. 下载服务代码
   - 下载项目代码到本地电脑，项目地址：`http://git.code.oa.com/qqpay_ui/toSeeWeb.git`
  3. 初始化数据库
   - 安装mysql数据库（建议版本Server version: 8.0.13 MySQL Community Server - GPL） 
   - 初始化数据库命令，如: `source /code/sql/tosee.sql`
  4. 启动服务
   - 跳转到对应项目代码的路径，如：`cd /Users/code `
   - 启动命令：`npm run start或pm2 start ./bin/www`
  5. 页面访问(由于使用了url地址透传，按钮、链接等不能直接跳转，根据路径访问对应页面)
   - 主页：localhost:8080
   - 个人中心：localhost:8080/person
   - 编译结果页(需要复制上传后的项目链接，更改为本机地址+端口)，如：localhost:8080/edit?id=9b288f20-30f8-11e9-8839-1f15855e680f&name=20190215160632_0list

## 5.目录结构

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
│     ├── projects        # 所有项目页面
│     ├── start.ejs       # 鉴权服务页面(部署在linux服务器上，用于鉴权，鉴权信息传递给mac主服务)
│     ├── tips.ejs        # 提示页面(如404错误)
│     └── visitor.js      # 访客页面
├── app.js                # 服务配置总入口
├── package-lock.json  
└── package.json                             
```

## 6.相关文章/辅助工具
相关文章
1. 视觉编译-让机器理解设计：http://km.oa.com/group/15849/articles/show/367169
2. 视觉编译开源宣讲PPT: http://km.oa.com/group/15849/articles/show/367169

辅助工具
1. 图元合并权重调试：http://uitocode.oa.com/plug/meta-rule/meta-rule.html
2. 图片绝对定位检查(designTree检验工具)：http://km.oa.com/group/15849/articles/show/367169
3. 布局及模型命中率检查(dsl检验工具)：http://km.oa.com/group/15849/articles/show/367169
4. AI打标任务协同：http://km.oa.com/group/15849/articles/show/367169

## 7.许可声明/交流群
#### 注意：项目仅供腾讯内部开源，源代码未经授权，禁止对外公开

![](http://km.oa.com/files/photos/pictures/201902/1550227512_64_w477_h477.jpg)
