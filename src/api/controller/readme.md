# CoreServer 接口文档

## DesignJson

### 1. design 设计稿预处理

#### 基本信息

- `path: /v2/designinit`
- `method: POST`
- 描述：设计稿预处理接口，构造数据源，一个设计稿对应一次预处理

#### 参数

| 参数名                            | 是否必传 | 类型   | 默认值   | 描述           |
| --------------------------------- | -------- | ------ | -------- | -------------- |
| fileType                          | 否       | string | 'sketch' | 设计稿类型     |
| data                              | 是       | Object |          | 设计稿数据     |
| &nbsp;&nbsp;&nbsp;&nbsp;pagesPath | 是       | string |          | 设计稿文件地址 |

#### 返回

| 字段名                            | 是否必传 | 类型   | 默认值 | 描述                      |
| --------------------------------- | -------- | ------ | ------ | ------------------------- |
| state                             | 是       | Object |        | 请求状态， 0-异常；1-正常 |
| msg                               | 否       | string |        | 错误提示语                |
| data                              | 是       | Object |        | 返回数据体                |
| &nbsp;&nbsp;&nbsp;&nbsp;dataToken | 是       | string |        | 预处理缓存文件名          |

#### 示例

- 入参

```json

```

- 返回

```json

```

### 2. design 设计稿单页解析

#### 基本信息

- `path: /v2/designparse`
- `method: POST`
- 描述：设计稿 artboard 解析接口，返回图元描述数组和图片描述数组

#### 参数

| 参数名                            | 是否必传 | 类型   | 默认值   | 描述                                         |
| --------------------------------- | -------- | ------ | -------- | -------------------------------------------- |
| artboardId                        | 是       | string |          | artboard id                                  |
| fileType                          | 否       | string | 'sketch' | 设计稿类型                                   |
| condition                         | 否       | number | 0        | 0-正常解析流程；1-获取清洗前数据；2-局部解析 |
| data                              | 是       | Object |          | 设计稿数据                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;dataToken | 是       | string |          | 预处理缓存文件名                             |

#### 返回

| 字段名                         | 是否必传 | 类型      | 默认值 | 描述                                         |
| ------------------------------ | -------- | --------- | ------ | -------------------------------------------- |
| state                          | 是       | Object    |        | 请求状态， 0-异常；1-正常；2-找不到文件      |
| msg                            | 否       | string    |        | 错误提示语                                   |
| data                           | 是       | Object    |        | 返回数据体                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;nodes  | 是       | QObject[] |        | 图元描述数组，供 DSL 处理                    |
| &nbsp;&nbsp;&nbsp;&nbsp;images | 否       | QImage[]  |        | 图片描述数组，包含 imageChildren，供绘图处理 |
