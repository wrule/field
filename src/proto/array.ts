import { EType } from '../type';
import { StringHash } from '../utils';
import { Field } from './field';

/**
 * 所有array型字段的顶级抽象类
 */
export abstract class ArrayField extends Field {
  /**
   * 构造函数
   * @param name 字段名称
   * @param element array的构成元素字段
   */
  constructor(
    name: string,
    protected element: Field,
  ) {
    super(name, EType.Array);
  }

  /**
   * 获取array的构成元素字段
   */
  abstract Element: Field;

  /**
   * 计算array型字段的结构的hash
   * 具体算法如下所示
   * @returns hash
   */
  public Hash() {
    return StringHash(`${this.Element.Hash()}[]`);
  }
}

// review 2021年07月26日17:25:59
