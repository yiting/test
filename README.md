# 视觉编译
把设计语言翻译为计算机语言，实现UI界面还原。

官网：http://uitocode.oa.com

1.视觉编译-让机器理解设计：http://km.oa.com/group/15849/articles/show/367169
2.视觉编译-UI界面的DSL算法(上) ：http://km.oa.com/group/15849/articles/show/370283
3.视觉编译-切图快到没朋友：http://km.oa.com/group/15849/articles/show/370832
4.视觉编译-如何构建UI界面元素的布局关系：http://km.oa.com/group/15849/articles/show/374138

任务列表
工程师们在玩命赶工中：http://tapd.oa.com/uitocode2/board/index?board_id=1020406492000017341&board_type=resource&view_type=list

## 目录
1. 解决什么问题
2. 解决方案
3. 任务列表
4. 快速搭建环境
5. 目录结构
6. 相关链接
7. 许可声明/交流群

## 1.解决什么问题
- 程序依照设计稿生成ui界面代码（支持多种语言）。
- 减少视觉设计师与开发联合走查设计还原的工作量。
- 生成页面直接供前台使用，减少ui还原的环节。

## 2.解决方案
![](http://km.oa.com/files/photos/pictures/201901/1547005473_87_w966_h636.png)

## 3.任务列表
```
1.勾选表示已完成或进行中，未勾选表示尚未开始，需要大家的帮助。
2.对下述各环节有更好的思路及方案，随时加入修改。
3.【有兴趣加入的同学，我们会安排专人帮你搭建运行环境】
```
- [ ] DesignJson（`负责人yonechen、ralychen`）：将视觉稿图层抽象为图元树。http://mrw.so/57KPAJ
  - [x] Parser图元抽象-Sketch
  - [ ] Parser图元抽象-Photoshop
  - [ ] Parser图元抽象-XD
  - [x] Optimize图元优化
- [ ] DSL（`负责人chrisschen`）：对设计元素数据进行抽象并输出统一结构的模块。http://mrw.so/58vvje
  - [x] 元素模型、组件模型的识别及组合匹配算法块（识别及匹配出模型）。 
  - [x] 模型数据进行组装结构化算法块（模型数据组成DSL树）。 
  - [x] DSL树进行布局处理及循环分析算法块（DSL树布局分析）。
  - [ ] 优化模型识别（模型设计、算法、AI辅助）。
  - [ ] 优化DSL树的结构（算法）。
  - [ ] 优化循环结构处理（算法）。
- [ ] Render&Template（`负责人chironyang`）：通过模板引擎的重组能力和样式映射关系，把设计数据解析成终端代码。http://mrw.so/5g1Hy9
  - [x] XML解析引擎，解析XML结构模板，生成json结构的数据
  - [ ] 静态模板组装引擎，根据数据特点，把节点内容替换成模板内容
  - [x] 动态模板组装引擎，根据模板数据结合RenderTree生成TemplateData
  - [x] HTML模板组装引擎，继承于动态模板组装引擎，根据HTML特性，把生成符合HTML特点的TemplateData
  - [ ] 优化「HTML模板组装引擎」的语义化逻辑
  - [ ] 优化Css_Dom样式输出的继承性问题
  - [ ] 优化Css_Dom样式输出的默认属性问题
  - [ ] 优化H5_builder中,样式名组合逻辑
  - [ ] 设计稿分辨率兼容
- [ ] AI虚拟目标识别（`负责人ralychen`）：对设计稿的图元以及UI结构识别。http://mrw.so/4pnNWF
  - [ ] 完善增加design15数据集。
  - [x] 识别图元(icon,img)结构，为合图提供合并的判断条件。 
  - [x] 识别页面UI模块，为页面结构生成提供判断条件。 
  - [x] 识别元素接口开放，返回查询字段。 
- [ ] 图像合成/绘图去重（`负责人yixionglin、bowentang`）：找出该合成的图元并进行绘制，对重复的图片资源进行去重。
  - [x] 图片合成逻辑 http://mrw.so/4Lgu1W
  - [x] 图片绘制-sketch http://mrw.so/58vuKI
  - [x] 图片绘制-psd http://mrw.so/4SIuXV
  - [ ] 图片绘制-xd
  - [x] 重复图片，去重处理 
- [ ] 多语言解析和生成（`负责人chrisschen、chironyang`）：将视觉稿根据开发语言要求生成对应代码。文档待补充
  - [x] Html/css语言 
  - [x] Hippy
  - [ ] 微信小程序
  - [ ] Vue
  - [ ] PC版（Html/css）支持
  - [ ] Android
  - [ ] IOS
- [ ] 编译平台（`负责人alltasxiao`）：将设计稿一键智能生成代码的平台。http://uitocode.oa.com
  - [x] 上传、解析、编译、下载、预览。 
  - [x] 关键数据存储(上传文件、解压数据、编译项目、下载项目)；操作记录日志。
  - [x] 个人中心(个人项目、浏览项目)、访客统计、所有项目、开发者工具、设计规范。 
  - [x] 编译页资源提取、面板操作(测距、单位转换等)。 
  - [ ] 底层基础库版本比对定时任务待接入
  - [ ] AI+普通规则待接入


## 4.快速搭建环境 【有兴趣加入的同学，我们会安排专人帮你搭建运行环境】
```
背景：由于视觉编译服务底层绘图模块使用了sketch和gm运行库，而sketch绘图库目前只能在mac电脑下运行(后续可研究是否可反编译，运行在其他平台)，因此该项目主要部署mac电脑,
部分鉴权服务部署在linux服务器。linux服务器上主要用于获取鉴权信息(公司鉴权信息端口受限，只能80端口，而mac上80端口被系统服务占用，所以采用linux服务器鉴权，获取到鉴权
用户信息后给到mac主服务)，mac服务器拿到鉴权信息完成剩下的整个编译操作。
```

  1. 安装绘图环境
   -  sketch：负责绘图 
      - 在mac电脑上安装sketch软件，鼠标右键显示包内容，将该软件包拷贝在项目/server_modules/designimage下面
   -  gm：负责合图
      - 安装imageMagick底层绘图软件：`brew install imagemagick && brew install graphicsmagick`
      - 安装node桥接包(https://www.npmjs.com/package/gm)：`npm install gm && npm install gm-base64`
  2. 下载项目代码
   - 下载项目代码到本地电脑，项目地址：`http://git.code.oa.com/qqpay_ui/toSeeWeb.git`
  3. 初始化数据库
   - 安装mysql数据库（建议版本Server version: 8.0.13 MySQL Community Server - GPL） 
   - 初始化数据库命令，如: `source /code/sql/tosee.sql`
  4. 启动服务
   - 跳转到对应项目代码的路径，如：`cd /Users/code `
   - 启动命令：`npm run start或pm2 start ./bin/www`
  5. 访问页面(由于使用了url地址透传，按钮、链接等不能直接跳转，根据路径访问对应页面)
```
说明：由于鉴权信息在线上服务器进行，本地部署无法获取用户信息。在本地部署时，先登录http://uitocode.oa.com，获取的用户信息存储在浏览器cookie中。这样本地部署访问时，
即可根据用户信息进行一系列数据库持久化操作。
```
   - 主页：localhost:8080
   - 个人中心：localhost:8080/person
   - 编译结果页(需要复制上传后的项目链接，更改为本机地址+端口)，如：localhost:8080/edit?id=9b288f20-30f8-11e9-8839-1f15855e680f&name=20190215160632_0list

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>`搭建环境过程中有任何问题，请联系：alltasxiao(肖超)`</strong>
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
│     ├── projects.ejs    # 所有项目页面
│     ├── start.ejs       # 鉴权服务页面(部署在linux服务器上，用于鉴权，鉴权信息传递给mac主服务)
│     ├── tips.ejs        # 提示页面(如404错误)
│     └── visitor.ejs     # 访客页面
├── app.js                # 服务配置总入口
├── package-lock.json  
└── package.json                             
```

## 6.相关链接
相关文章
1.视觉编译-让机器理解设计：http://km.oa.com/group/15849/articles/show/367169
2.视觉编译-UI界面的DSL算法(上) ：http://km.oa.com/group/15849/articles/show/370283
3. 视觉编译开源宣讲PPT: `URL待补充`

辅助工具
1. 图元合并权重调试：`URL待补充`
2. 图片绝对定位检查(designTree检验工具)：`URL待补充`
3. 布局及模型命中率检查(dsl检验工具)：`URL待补充`
4. AI打标任务协同：`URL待补充`
5. AI目标识别检查：`URL待补充`
6. 提取UI组件特征及代码绑定：`URL待补充`


## 7.许可声明/交流群
#### 注意：项目仅供腾讯内部开源，源代码未经授权，禁止对外公开

视觉编译开发者交QQ流群： 477963529
![](http://km.oa.com/files/photos/pictures/201902/1550227512_64_w477_h477.jpg)

### 最后，感谢以下成员业余时间友情支持：
感谢 CSIG优图实验室 hongyuzhou 对AI目标识别的技术指导！
感谢 ISUX碳黑设计组 trevorpang、skymlhuang 交互设计指导！
感谢 IEG互动娱乐发行线/设计中心/UI开发组 PSD技术支持！
感谢 浏览平台产品部/平台开发组 Hippy技术支持！

### 项目相关代码仅对内部交流，请勿外传！谢谢！