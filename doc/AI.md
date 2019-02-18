# 虚拟目标识别（AI）
## 概述
虚拟目标识别模块是对整个设计稿进行desgin15标签的识别，将识别结果用于整个流程的全过程，包括图片合并，模块渲染等。
desgin15标签模块包含以下15个
1.icon
![icon标签](./images/ai_1.png)
2.icondesc
![icondesc标签](./images/ai_2.png)
3.img
![img标签](./images/ai_3.png)
4.imgdesc
![imgdesc标签](./images/ai_4.png)
5.button
![button标签](./images/ai_5.png)
6.tab
![tab标签](./images/ai_6.png)
7.banner
![banner标签](./images/ai_7.png)
8.dialog
9.tips
10.input
11.scroll
12.feeds
13.list
14.text
15.信号栏
## 数据集格式，以及标注方式
数据集格式为voc格式，标注工具采用自研标注平台。
## 目标识别网络
faster RCNN
## 分类网络
res101