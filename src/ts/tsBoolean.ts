import { Field } from '../proto/field';
import { EType } from '../type';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { CodeBoolean } from './codeModel/codeBoolean';
import { IModel } from './model';
import { TsField } from './tsField';
import { TsUnion } from './tsUnion';
import { CodeModel } from './codeModel/codeModel';
import { Common } from './common';
import { JsField } from '../js/jsField';
import { JsFactory } from '../js/jsFactory';

export class TsBoolean extends Field implements TsField {
  constructor(name: string) {
    super(name, EType.Boolean);
  }

  public Clone(name?: string): TsField {
    return Common.Clone(this, name);
  }

  @BeforeContain()
  public Contain(tsField: TsField) {
    return false;
  }

  @BeforeCompare()
  public Compare(tsField: TsField) {
    return 0;
  }

  @BeforeMerge()
  public Merge(tsField: TsField): TsField {
    return new TsUnion(this.Name, [this.Clone(), tsField.Clone()]);
  }

  public Diff(tsField: TsField): [TsField, TsField][] {
    if (!this.Equal(tsField)) {
      return [[this.Clone(), tsField.Clone()]];
    }
    return [];
  }

  @BeforeDefineJsField()
  public DefineJsField(jsField: JsField) {
    return false;
  }

  @BeforeUpdateJsField()
  public UpdateJsField(jsField: JsField): TsField {
    return this.Merge(jsField.ToTs());
  }

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
    };
  }

  public ToCodeModel(parent?: CodeModel) {
    return new CodeBoolean(this, parent);
  }
}

// review 2021年07月27日13:22:02
