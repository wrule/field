# Field
## 简介
生成复杂JSON数据的TypeScript模型，然后你可以生成模型的接口定义代码，甚至比较，合并，优化你的模型，最终你也可以选择持久化存储这个模型
## 安装
```shell
npm install @wrule/field
```
## 基本用法
```js
import { TS } from '@wrule/field';

// 创建一个TypeScript的Union模型
const union = TS(1)
  .Add('jimao')
  .Add(true)
  .Add(false)
  .Add([
    { name: 'trump', age: 79 },
    { name: 'jimao' },
  ])
  .ToCodeModel();

// 打印联合模型的定义名称
console.log(union.InterfaceName);
// 输出如下：
(number | string | boolean | ISomethingMember3Element[])

// 打印联合模型的子接口定义代码
console.log(union.DefineCode());
// 输出如下：
//#region ISomethingMember3Element接口定义
export interface ISomethingMember3Element {
  ['name']: string;
  ['age']: (number | undefined);
  [propName: string]: any;
}
//#endregion
```
## 更多用法
### 相等
```js
import { TS } from '@wrule/field';

TS(1).Equal(TS(2))
// true
TS(1).Equal(TS('hello'))
// false
```
### 包含
```js
import { TS } from '@wrule/field';

TS(1).Add('trump').Contain(TS('jimao'))
// true
```
### 比较
```js
TS(1).Compare(TS(2))
// 1
TS({ name: 'jimao' }).Compare(TS({ name: 'trump', age: 79 }))
// 0.5
```
### 合并
```js
import { TS } from '@wrule/field';

TS(1).Merge(TS('hello'));
```
### 更新
```js
import { TS } from '@wrule/field';

TS(1).Update('hello');
```
### 定义
```js
import { TS } from '@wrule/field';

TS(1).Define(2);
```
### 追加
```js
import { TS } from '@wrule/field';

TS(1).Add('hello');
```
### 对比
```js
import { TS } from '@wrule/field';

TS(1).Diff('hello');
```
### 持久化
```js
import { TS } from '@wrule/field';

TS({ name: 'trump', age: 79 }).ToModelCode();
```
