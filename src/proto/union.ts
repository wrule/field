import { EType } from '../type';
import { StringHash } from '../utils';
import { Field } from './field';

/**
 * 所有union型字段的顶级抽象类
 */
export abstract class UnionField extends Field {
  /**
   * 构造函数
   * @param name 字段名称
   * @param members union的成员字段列表
   */
  constructor(
    name: string,
    protected members: Field[],
  ) {
    super(name, EType.Union);
  }

  /**
   * 获取union的成员字段列表
   */
  abstract Members: Field[];

  /**
   * 计算union型字段的结构的hash
   * 这里对于成员字段按hash排序后计算hash，确保了成员顺序不会影响hash
   * @returns hash
   */
  public Hash() {
    const members = this.Members.slice();
    members.sort((a, b) => a.Hash().localeCompare(b.Hash()));
    return StringHash(
      members
        .map((member) => member.Hash())
        .join('|')
    );
  }
}

// review 2021年07月26日17:35:10
