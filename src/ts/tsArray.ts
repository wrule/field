
import { JsArray } from '../js/jsArray';
import { JsField } from '../js/jsField';
import { ArrayField } from '../proto/array';
import { EType } from '../type';
import { CodeArray } from './codeModel/codeArray';
import { CodeModel } from './codeModel/codeModel';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { IModel } from './model';
import { TsField } from './tsField';
import { TsMerger } from './tsMerger';
import { TsTuple } from './tsTuple';
import { TsUnion } from './tsUnion';
import { Common } from './common';
import { JsFactory } from '../js/jsFactory';

export class TsArray extends ArrayField implements TsField {
  constructor(
    name: string,
    element: TsField,
  ) {
    super(name, element.Clone('element'));
  }

  public get Element() {
    return this.element as TsField;
  }

  public Clone(name?: string): TsField {
    return Common.Clone(this, name);
  }

  @BeforeContain()
  public Contain(tsField: TsField): boolean {
    if (tsField.Type === EType.Array) {
      const arrayField = tsField as TsArray;
      return this.Element.Contain(arrayField.Element);
    } else if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple;
      return tupleField.Elements.every(
        (element) => this.Element.Contain(element)
      );
    } else {
      return false;
    }
  }
  // review 2021年07月27日16:16:48

  @BeforeCompare()
  public Compare(tsField: TsField): number {
    if (tsField.Type === EType.Array) {
      const arrayField = tsField as TsArray;
      // 0.1是同为数组的天然相似度
      return this.Element.Compare(arrayField.Element) * 0.9 + 0.1;
    } else if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple;
      const similarities = tupleField.Elements.map(
        (element) => this.Element.Compare(element)
      );
      // 数组与元组相似度依木桶短板计算元素最小相似度（因为这种相似度是[与关系]）
      const similarity = similarities.length > 0 ?
        Math.min(...similarities) :
        0;
      // 0.05是元组与数组的天然相似度
      return (similarity * 0.95) + 0.05;
    } else {
      return 0;
    }
  }
  // review 2021年07月27日16:24:26

  @BeforeMerge()
  public Merge(tsField: TsField): TsField {
    if (tsField.Type === EType.Array) {
      const arrayField = tsField as TsArray;
      return new TsArray(
        this.Name,
        this.Element.Merge(arrayField.Element),
      );
    } else if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple;
      if (this.Compare(tupleField) >= 0.1) {
        const element = TsMerger.Optimize(
          'element',
          [this.Element, ...tupleField.Elements],
        );
        return new TsArray(this.Name, element);
      } else {
        return new TsUnion(this.Name, [this, tupleField]);
      }
    } else {
      return new TsUnion(this.Name, [this, tsField]);
    }
  }
  // review 2021年07月27日16:35:41

  public Diff(tsField: TsField): [TsField, TsField][] {
    if (!this.Equal(tsField)) {
      return [[this.Clone(), tsField.Clone()]];
    }
    return [];
  }

  @BeforeDefineJsField()
  public DefineJsField(jsField: JsField) {
    if (jsField.Type === EType.Array) {
      const jsArrayField = jsField as JsArray;
      return jsArrayField.Elements
        .every((jsElement) => this.Element.DefineJsField(jsElement));
    }
    return false;
  }
  // review 2021年07月27日16:38:58

  @BeforeUpdateJsField()
  public UpdateJsField(jsField: JsField): TsField {
    const tsField = jsField.ToTs();
    if (jsField.Type === EType.Array) {
      if (this.Compare(tsField) >= 0.1) {
        const jsArrayField = jsField as JsArray;
        let updatedDst = this.Element;
        jsArrayField.Elements.forEach((jsElement) => {
          updatedDst = updatedDst.UpdateJsField(jsElement);
        });
        return new TsArray(this.Name, updatedDst);
      }
    }
    return this.Merge(tsField);
  }
  // review 2021年07月27日17:37:12

  public Define(data: any) {
    return this.DefineJsField(JsFactory.Create(this.Name, data));
  }

  public Update(data: any) {
    return this.UpdateJsField(JsFactory.Create(this.Name, data));
  }

  public Add(data: any) {
    return this.Update(data);
  }

  public ToModel(): IModel {
    return {
      type: this.Type,
      name: this.Name,
      children: [this.Element.ToModel()],
    };
  }

  public ToCodeModel(parent?: CodeModel) {
    return new CodeArray(this, parent);
  }
}

// review 2021年07月27日17:37:34
