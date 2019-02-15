# 视觉编译
通过算法把设计稿翻译为计算机语言，实现UI界面还原

## 目录
1. 解决什么问题
2. 解决方案
3. 任务列表（工作分担，及对应例子）
4. 快速搭建环境
5. 目录结构
6. 相关文章/辅助工具
7. 许可声明/交流群

## 1.解决什么问题
1. 程序依照设计稿生成ui界面代码（支持多种语言）。
2. 减少视觉设计师与开发联合走查设计还原的工作量。
3. 生成页面直接供前台使用，减少ui还原的环节。

## 2.解决方案
![](http://km.oa.com/files/photos/pictures/201901/1547005473_87_w966_h636.png)

## 3.任务列表
- [ ] DSL语言设计
  - [x] 提供组件绑定能力，A设计组件，绑定A或A相关代码片段。 demo
  - [x] 结构或样式去重处理，减少重复代码。 demo
  - [x] 生成流式布局页面，方面内容扩展。 demo
- [ ] AI页面元素识别
  - [ ] 识别页面元素，为合图及页面结构提供合并的判断条件。 demo
  - [ ] 识别元素接口开放，返回查询字段。 demo
- [ ] 图像合成/绘图去重
  - [ ] 重复图片，去重处理  demo
  - [ ] psd 
  - [ ] sketch
  - [ ] xd
- [ ] 图元处理
  - [ ]不需要任何人工参与，程序根据设计稿，自动切图。 demo

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
