
import { JsField } from '../js/jsField';
import { JsObject } from '../js/jsObject';
import { JsUndefined } from '../js/jsUndefined';
import { ObjectField } from '../proto/object';
import { EType } from '../type';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { IModel } from './model';
import { TsField } from './tsField';
import { TsUndefined } from './tsUndefined';
import { TsUnion } from './tsUnion';
import { CodeObject } from './codeModel/codeObject';
import { CodeModel } from './codeModel/codeModel';
import { Common } from './common';
import { JsFactory } from '../js/jsFactory';

export class TsObject extends ObjectField implements TsField {
  constructor(
    name: string,
    fieldsMap: Map<string, TsField>,
  ) {
    super(name, fieldsMap);
  }

  public get FieldsMap() {
    return this.fieldsMap as Map<string, TsField>;
  }

  public get Fields() {
    return Array.from(this.FieldsMap.values());
  }

  public Clone(name?: string): TsField {
    return Common.Clone(this, name);
  }

  @BeforeContain()
  public Contain(tsField: TsField): boolean {
    if (tsField.Type === EType.Object) {
      const objectField = tsField as TsObject;
      return Common.AllFieldNames(this, objectField).every((name) => {
        const field1 = this.FieldsMap.get(name);
        const field2 = objectField.FieldsMap.get(name) || new TsUndefined(name);
        return field1 && field1.Contain(field2);
      });
    } else {
      return false;
    }
  }

  @BeforeCompare()
  public Compare(tsField: TsField): number {
    if (tsField.Type === EType.Object) {
      const objectField = tsField as TsObject;
      const maxLength = Common.AllFieldNames(this, objectField).length;
      const cmpFields = this.Fields.filter(
        (field) => objectField.FieldsMap.has(field.Name)
      );
      let sum = 0;
      cmpFields.forEach((field) => {
        sum += field.Compare(
          objectField.FieldsMap.get(field.Name) as TsField
        ) * 0.7 + 0.3;
      });
      return sum / (maxLength || 1);
    } else {
      return 0;
    }
  }

  @BeforeMerge()
  public Merge(tsField: TsField): TsField {
    if (tsField.Type === EType.Object) {
      const objectField = tsField as TsObject;
      const similarity = this.Compare(objectField);
      if (similarity >= 0.1) {
        const newFields = Common.AllFieldNames(this, objectField).map((name) => {
          const field1 = this.FieldsMap.get(name) || new TsUndefined(name);
          const field2 = objectField.FieldsMap.get(name) || new TsUndefined(name);
          return field1.Merge(field2);
        });
        const newFieldsMap = new Map<string, TsField>(
          newFields.map((field) => [field.Name, field])
        );
        return new TsObject(this.Name, newFieldsMap);
      } else {
        return new TsUnion(this.Name, [this, objectField]);
      }
    } else {
      return new TsUnion(this.Name, [this, tsField]);
    }
  }

  @BeforeDefineJsField()
  public DefineJsField(jsField: JsField) {
    if (jsField.Type === EType.Object) {
      const jsObjectField = jsField as JsObject;
      if (jsObjectField.Fields.length <= this.Fields.length) {
        return Common.AllFieldNames(this, jsObjectField).every((name) => {
          const defTsField = this.FieldsMap.get(name);
          const defJsField = jsObjectField.FieldsMap.get(name) || new JsUndefined(name);
          return defTsField && defTsField.DefineJsField(defJsField);
        });
      }
    }
    return false;
  }

  @BeforeUpdateJsField()
  public UpdateJsField(jsField: JsField): TsField {
    const tsField = jsField.ToTs();
    if (jsField.Type === EType.Object) {
      if (this.Compare(tsField) >= 0.1) {
        const jsObjectField = jsField as JsObject;
        const newTsFields = Common.AllFieldNames(this, jsObjectField).map((name) => {
          const updateTsField = this.FieldsMap.get(name) || new TsUndefined(name);
          const updateJsField = jsObjectField.FieldsMap.get(name) || new JsUndefined(name);
          return updateTsField.UpdateJsField(updateJsField);
        });
        return new TsObject(this.Name, new Map<string, TsField>(
          newTsFields.map((field) => [field.Name, field])
        ));
      }
    }
    return this.Merge(tsField);
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
      children: this.Fields.map((field) => field.ToModel()),
    };
  }

  public ToCodeModel(parent?: CodeModel) {
    return new CodeObject(this, parent);
  }
}

// review 2021年07月27日16:11:06
