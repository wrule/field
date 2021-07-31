import { EType } from '../type';
import { StringHash } from '../utils';

/**
 * 所有field的顶级抽象类
 */
export abstract class Field {
  /**
   * 构造函数
   * @param name 字段名称
   * @param type 字段类型
   */
  constructor(
    private name: string,
    private type: EType,
  ) { }

  /**
   * 字段名称
   */
  public get Name() {
    return this.name;
  }

  /**
   * 字段类型
   */
  public get Type() {
    return this.type;
  }

  /**
   * 基本类型的hash
   * 静态属性，类加载的时候构造
   */
  private static hashs = new Map<EType, string>([
    [EType.Undefined, StringHash(EType.Undefined)],
    [EType.Null, StringHash(EType.Null)],
    [EType.Boolean, StringHash(EType.Boolean)],
    [EType.Number, StringHash(EType.Number)],
    [EType.String, StringHash(EType.String)],
    [EType.Date, StringHash(EType.Date)],
    [EType.Unknown, StringHash(EType.Unknown)],
  ]);

  /**
   * 获取字段结构的hash
   * @returns hash
   */
  public Hash() {
    if (Field.hashs.has(this.Type)) {
      return Field.hashs.get(this.Type) as string;
    }
    throw new Error('非基本类型的Hash方法未实现');
  }

  /**
   * 判断两个字段的结构是否相等
   * @param field 目标字段
   * @returns 是否相等
   */
  public Equal(field: Field): boolean {
    return field.Hash() === this.Hash();
  }
}

// review 2021年07月26日17:07:08
