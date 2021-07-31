import { JsField } from '../js/jsField';
import { UnionField } from '../proto/union';
import { EType } from '../type';
import { CodeModel } from './codeModel/codeModel';
import { CodeUnion } from './codeModel/codeUnion';
import { BeforeCompare, BeforeContain, BeforeDefineJsField, BeforeMerge, BeforeUpdateJsField } from './decorators';
import { IModel } from './model';
import { TsField } from './tsField';
import { TsMerger } from './tsMerger';
import { Common } from './common';
import { JsFactory } from '../js/jsFactory';

export class TsUnion extends UnionField implements TsField {
  constructor(
    name: string,
    members: TsField[],
  ) {
    super(
      name,
      members.map((member, index) => member.Clone(`member${index}`))
    );
  }

  public get Members() {
    return this.members as TsField[];
  }

  public Clone(name?: string): TsField {
    return Common.Clone(this, name);
  }

  @BeforeContain()
  public Contain(tsField: TsField): boolean {
    return this.Members.some(
      (member) => member.Contain(tsField)
    );
  }
  // review 2021年07月27日23:59:15

  @BeforeCompare()
  public Compare(tsField: TsField): number {
    const similarities: number[] = [];
    if (tsField.Type === EType.Union) {
      const unionField = tsField as TsUnion;
      for (let i = 0; i < this.Members.length; ++i) {
        for (let j = 0; j < unionField.Members.length; ++j) {
          similarities.push(
            this.Members[i].Compare(unionField.Members[j])
          );
        }
      }
    } else {
      this.Members.forEach((member) => {
        similarities.push(member.Compare(tsField));
      });
    }
    return similarities.length > 0 ?
      Math.max(...similarities) :
      0;
  }
  // review 2021年07月28日00:09:21

  @BeforeMerge()
  public Merge(tsField: TsField): TsField {
    // 混合成员最优合并
    const newMembers = this.Members.slice();
    if (tsField.Type === EType.Union) {
      const unionField = tsField as TsUnion;
      newMembers.push(...unionField.Members);
    } else {
      newMembers.push(tsField);
    }
    return TsMerger.Optimize(this.Name, newMembers);
  }
  // review 2021年07月28日00:13:17

  public Diff(tsField: TsField): [TsField, TsField][] {
    if (!this.Equal(tsField)) {
      return [[this.Clone(), tsField.Clone()]];
    }
    return [];
  }

  @BeforeDefineJsField()
  public DefineJsField(jsField: JsField) {
    return this.Members.some((member) => member.DefineJsField(jsField));
  }

  @BeforeUpdateJsField()
  public UpdateJsField(jsField: JsField): TsField {
    const tsField = jsField.ToTs();
    return TsMerger.Optimize(this.Name, [...this.Members, tsField]);
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
      children: this.Members.map((member) => member.ToModel()),
    };
  }

  public ToCodeModel(parent?: CodeModel) {
    return new CodeUnion(this, parent);
  }
}

// review 2021年07月28日00:21:13
