import { Field } from '../proto/field';
import { EType } from '../type';
import { CodeModel } from './codeModel/codeModel';
import { CodeUnknown } from './codeModel/codeUnknown';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { IModel } from './model';
import { TsField } from './tsField';
import { Common } from './common';
import { JsField } from '../js/jsField';
import { JsFactory } from '../js/jsFactory';

export class TsUnknown extends Field implements TsField {
  constructor(name: string) {
    super(name, EType.Unknown);
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
    return tsField.Clone(this.Name);
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
    return new CodeUnknown(this, parent);
  }
}

// review 2021年07月27日13:34:48
