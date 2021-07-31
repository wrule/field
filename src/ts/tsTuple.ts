
import { JsArray } from '../js/jsArray';
import { JsField } from '../js/jsField';
import { JsUndefined } from '../js/jsUndefined';
import { TupleField } from '../proto/tuple';
import { EType } from '../type';
import { CodeModel } from './codeModel/codeModel';
import { CodeTuple } from './codeModel/codeTuple';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { IModel } from './model';
import { TsField } from './tsField';
import { TsMerger } from './tsMerger';
import { TsUndefined } from './tsUndefined';
import { TsUnion } from './tsUnion';
import { Common } from './common';
import { JsFactory } from '../js/jsFactory';

export class TsTuple extends TupleField implements TsField {
  constructor(
    name: string,
    elements: TsField[],
  ) {
    super(
      name,
      elements.map((element, index) => element.Clone(`element${index}`))
    );
  }

  public get Elements() {
    return this.elements as TsField[];
  }

  public Clone(name?: string): TsField {
    return Common.Clone(this, name);
  }

  @BeforeContain()
  public Contain(tsField: TsField): boolean {
    if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple;
      return (
        this.Elements.length >= tupleField.Elements.length &&
        this.Elements.every(
          (element, index) => element.Contain(
            tupleField.Elements[index] || new TsUndefined(`element${index}`)
          )
        )
      );
    } else {
      return false;
    }
  }
  // review 2021年07月27日18:06:40

  @BeforeCompare()
  public Compare(tsField: TsField): number {
    if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple;
      const maxLength = Common.MaxLength(this.Elements, tupleField.Elements);
      let sum = 0;
      for (let i = 0; i < maxLength; ++i) {
        const field1 = this.Elements[i];
        const field2 = tupleField.Elements[i];
        if (field1 && field2) {
          sum += field1.Compare(field2);
        }
      }
      return sum / (maxLength || 1);
    } else if (tsField.Type === EType.Array) {
      return tsField.Compare(this);
    } else {
      return 0;
    }
  }
  // review 2021年07月27日18:18:34

  @BeforeMerge()
  public Merge(tsField: TsField): TsField {
    if (tsField.Type === EType.Tuple) {
      const tupleField = tsField as TsTuple
      const similarity = this.Compare(tupleField);
      if (similarity >= 0.1) {
        const maxLength = Common.MaxLength(this.Elements, tupleField.Elements);
        const newElements: TsField[] = [];
        for (let i = 0; i < maxLength; ++i) {
          const field1 = this.Elements[i] || new TsUndefined(`element${i}`);
          const field2 = tupleField.Elements[i] || new TsUndefined(`element${i}`);
          newElements.push(field1.Merge(field2));
        }
        return TsMerger.ArrayMerge(this.Name, newElements);
      } else {
        return new TsUnion(this.Name, [this, tupleField]);
      }
    } else {
      return new TsUnion(this.Name, [this, tsField]);
    }
  }
  // review 2021年07月27日18:28:00

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
      if (jsArrayField.Elements.length <= this.Elements.length) {
        return this.Elements.every((tsElement, index) => (
          tsElement.DefineJsField(
            jsArrayField.Elements[index] || new JsUndefined(`element${index}`)
          )
        ));
      }
    }
    return false;
  }
  // review 2021年07月27日18:33:33

  @BeforeUpdateJsField()
  public UpdateJsField(jsField: JsField): TsField {
    const tsField = jsField.ToTs();
    if (jsField.Type === EType.Array) {
      if (this.Compare(tsField) >= 0.1) {
        const jsArrayField = jsField as JsArray;
        const maxLength = Common.MaxLength(this.Elements, jsArrayField.Elements);
        const newElements: TsField[] = [];
        for (let i = 0; i < maxLength; ++i) {
          const updateTsField = this.Elements[i] || new TsUndefined(`element${i}`);
          const updateJsField = jsArrayField.Elements[i] || new JsUndefined(`element${i}`);
          newElements.push(updateTsField.UpdateJsField(updateJsField));
        }
        return TsMerger.ArrayMerge(this.Name, newElements);
      }
    }
    return this.Merge(tsField);
  }
  // review 2021年07月27日20:31:51

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
      children: this.Elements.map((element) => element.ToModel()),
    };
  }

  public ToCodeModel(parent?: CodeModel) {
    return new CodeTuple(this, parent);
  }
}

// review 2021年07月27日20:48:59
