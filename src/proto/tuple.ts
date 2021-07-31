import { EType } from '../type';
import { StringHash } from '../utils';
import { Field } from './field';

/**
 * 所有tuple型字段的顶级抽象类
 */
export abstract class TupleField extends Field {
  /**
   * 构造函数
   * @param name 字段名称
   * @param elements tuple的构成元素字段列表
   */
  constructor(
    name: string,
    protected elements: Field[],
  ) {
    super(name, EType.Tuple);
  }

  /**
   * 获取tuple的构成元素字段列表
   */
  abstract Elements: Field[];

  /**
   * 计算tuple型字段的结构的hash
   * 具体算法如下所示
   * @returns hash
   */
  public Hash() {
    return StringHash(
      this.Elements
        .map((element) => element.Hash())
        .join(',')
    );
  }
}

// review 2021年07月26日17:30:24
