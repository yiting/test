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

| 参数名                            | 是否必传 | 类型     | 默认值   | 描述                                         |
| --------------------------------- | -------- | -------- | -------- | -------------------------------------------- |
| artboardId                        | 是       | string   |          | artboard id                                  |
| fileType                          | 否       | string   | 'sketch' | 设计稿类型                                   |
| condition                         | 否       | number   | 0        | 0-正常解析流程；1-获取清洗前数据；2-局部解析 |
| data                              | 是       | Object   |          | 设计稿数据                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;dataToken | 是       | string   |          | 预处理缓存文件名                             |
| &nbsp;&nbsp;&nbsp;&nbsp;idList    | 否       | string[] |          | 选择编译的节点 id 列表                       |
| &nbsp;&nbsp;&nbsp;&nbsp;font      | 否       | Object   |          | 字体信息                                     |

#### 返回

| 字段名                         | 是否必传 | 类型      | 默认值 | 描述                                         |
| ------------------------------ | -------- | --------- | ------ | -------------------------------------------- |
| state                          | 是       | Object    |        | 请求状态， 0-异常；1-正常；2-找不到文件      |
| msg                            | 否       | string    |        | 错误提示语                                   |
| data                           | 是       | Object    |        | 返回数据体                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;nodes  | 是       | QObject[] |        | 图元描述数组，供 DSL 处理                    |
| &nbsp;&nbsp;&nbsp;&nbsp;images | 否       | QImage[]  |        | 图片描述数组，包含 imageChildren，供绘图处理 |
| &nbsp;&nbsp;&nbsp;&nbsp;rate   | 否       | number    | 1      | artboard 容器与 750 比率                     |

#### 示例

正常流程-获取

- 入参

```json
{
  "artboardId": "A23123242-243",
  "data": {
    "dataToken": "4342342"
  }
}
```

局部编译流程-获取未经清洗合图节点，供前端展示碎片框

- 入参

```json
{
  "artboardId": "A23123242-243",
  "condition": 1,
  "data": {
    "dataToken": "4342342"
  }
}
```

局部编译流程-对选择的节点进行解析+清洗合图，返回数据供 DSL 与绘图

- 入参

```json
{
  "artboardId": "A23123242-243",
  "condition": 2,
  "data": {
    "dataToken": "4342342",
    "idList": ["FH34234-DF456P", "J835GH435-4356K5T"]
  }
}
```

- 返回

```json
{
  "nodes": [
    {
      "name": "画板",
      "id": "A3424324-6575N",
      "type": "QLayer",
      "abX": 0,
      "abY": 0,
      "width": 750,
      "height": 1250,
      "styles": {}
    }
  ],
  "images": [
    {
      "name": "头像",
      "id": "B3424324-6575N",
      "type": "QImage",
      "path": "4234.png",
      "abX": 23,
      "abY": 56,
      "width": 150,
      "height": 150,
      "imageChildren": [],
      "styles": {}
    }
  ],
  "rate": 1
}
```
