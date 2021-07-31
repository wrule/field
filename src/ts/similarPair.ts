import { TsField } from './tsField';

/**
 * 用于记录相似字段信息的类
 */
export class SimilarPair {
  constructor(
    private srcIndex: number,
    private dstIndex: number,
    tsFieldsMap: Map<number, TsField>,
  ) {
    this.ReCompare(tsFieldsMap);
  }

  private similarity = 0;

  /**
   * 源索引
   */
  public get SrcIndex() {
    return this.srcIndex;
  }

  /**
   * 目标索引
   */
  public get DstIndex() {
    return this.dstIndex;
  }

  /**
   * 两者相似度
   */
  public get Similarity() {
    return this.similarity;
  }

  /**
   * 按阈值判断是否可以合并
   */
  public CanBeMerged(threshold: number = 0.1) {
    return this.Similarity >= threshold;
  }

  /**
   * 判断目标索引是否和本对相关联
   * @param index 目标索引
   * @returns 是否关联
   */
  public IsRelevant(index: number): boolean {
    return (
      this.srcIndex === index ||
      this.dstIndex === index
    );
  }

  /**
   * 传入最新的信息Map，重新计算字段对相似度
   * @param tsFieldsMap 最新的信息Map
   */
  public ReCompare(tsFieldsMap: Map<number, TsField>) {
    const srcTsField = tsFieldsMap.get(this.SrcIndex);
    if (!srcTsField) {
      throw new Error('索引不到源字段');
    }
    const dstTsField = tsFieldsMap.get(this.DstIndex);
    if (!dstTsField) {
      throw new Error('索引不到目标字段');
    }
    this.similarity = srcTsField.Compare(dstTsField);
  }
}

// review 2021年07月28日16:40:24
