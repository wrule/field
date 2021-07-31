import { Field } from '../proto/field';
import { IModel } from './model';
import { CodeModel } from './codeModel/codeModel';
import { JsField } from '../js/jsField';

/**
 * ts字段的定义接口
 */
export interface TsField extends Field {
  /**
   * 克隆自身，深度拷贝
   * @param name 新的名称，不传则不修改名称
   */
  Clone(name?: string): TsField;

  /**
   * 判断本ts字段的结构是否包含目标ts字段的结构
   * @param tsField 目标ts字段
   * @returns 是否包含
   */
  Contain(tsField: TsField): boolean;

  /**
   * 判断本ts字段的结构和目标ts字段的结构的相似度
   * @param tsField 目标ts字段
   * @returns 相似度（0 ~ 1）
   */
  Compare(tsField: TsField): number;

  /**
   * 合并本ts字段的结构与目标ts字段的结构，生成一个以本ts字段名称命名的新的ts字段
   * @param tsField 目标ts字段
   * @returns 新的ts字段
   */
  Merge(tsField: TsField): TsField;

  /**
   * 判断本ts字段的结构是否可以定义目标数据
   * @param data 目标数据
   * @returns 是否可以定义
   */
  Define(data: any): boolean;

  /**
   * 判断本ts字段的结构是否可以定义目标js字段
   * @param jsField 目标js字段
   * @returns 是否可以定义
   */
  DefineJsField(jsField: JsField): boolean;

  /**
   * 使用目标数据冲刷更新本ts字段的结构，生成一个新的ts字段
   * @param data 目标数据
   * @returns 新的ts字段
   */
  Update(data: any): TsField;

  /**
   * 与Update相同
   * @param data 目标数据
   * @returns 新的ts字段
   */
  Add(data: any): TsField;

  /**
   * 使用目标js字段冲刷更新本ts字段的结构，生成一个新的ts字段
   * @param jsField 目标js字段
   * @returns 新的ts字段
   */
  UpdateJsField(jsField: JsField): TsField;

  /**
   * 获取本ts字段的持久化存储模型
   * @returns 持久化存储模型
   */
  ToModel(): IModel;

  /**
   * 获取本ts字段的TypeScript定义代码模型
   * @param parent 父级模型
   * @returns TypeScript定义代码模型
   */
  ToCodeModel(parent?: CodeModel): CodeModel;
}

// review 2021年07月26日18:28:45
// review 2021年07月28日10:05:21
