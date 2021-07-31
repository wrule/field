import { Field } from '../proto/field';
import { TsField } from '../ts/tsField';

export interface JsField extends Field {
  /**
   * 提取TypeScript类型
   */
  ToTs(): TsField;
}

// review 2021年07月26日17:40:35
