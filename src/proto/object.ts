import { EType } from '../type';
import { StringHash } from '../utils';
import { Field } from './field';

/**
 * 所有object型字段的顶级抽象类
 */
export abstract class ObjectField extends Field {
  /**
   * 构造函数
   * @param name 字段名称
   * @param fieldsMap object的字段Map
   */
  constructor(
    name: string,
    protected fieldsMap: Map<string, Field>,
  ) {
    super(name, EType.Object);
  }

  /**
   * 以Map的形式获取object的字段
   */
  abstract FieldsMap: Map<string, Field>;

  /**
   * 以数组的形式获取object的字段
   */
  abstract Fields: Field[];

  /**
   * 计算object型字段的结构的hash
   * 这里对于字段按名称排序后计算hash，确保了字段顺序不会影响hash
   * @returns hash
   */
  public Hash() {
    const fields = this.Fields.slice();
    fields.sort((a, b) => a.Name.localeCompare(b.Name));
    return StringHash(
      fields
        .map((field) => `${field.Name}:${field.Hash()}`)
        .join(';')
    );
  }
}

// review 2021年07月26日17:20:35
