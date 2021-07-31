import { ArrayField } from '../proto/array';
import { TsMerger } from '../ts/tsMerger';
import { StringHash } from '../utils';
import { JsField } from './jsField';
import { JsUnknown } from './jsUnknown';

export class JsArray extends ArrayField implements JsField {
  constructor(
    name: string,
    protected elements: JsField[],
  ) {
    super(name, new JsUnknown('element'));
  }

  /**
   * 这里覆盖抽象类ArrayField中的Hash方法
   * 这里如果不覆盖实现的话，hash会为any[]的hash
   * @returns hash
   */
  public Hash() {
    return StringHash(
      this.Elements
        .map((element) => element.Hash())
        .join(',')
    );
  }

  public get Elements() {
    return this.elements;
  }

  public get Element() {
    return this.element as JsField;
  }

  public ToTs() {
    const tsElements = this.Elements
      .map((element) => element.ToTs());
    return TsMerger.ArrayMerge(this.Name, tsElements);
  }
}

// review 2021年07月26日17:57:17
