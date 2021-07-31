import { CodeModel } from './codeModel';
import { TsUnion } from '../tsUnion';

export class CodeUnion extends CodeModel {
  constructor(
    tsField: TsUnion,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsUnion {
    return this.tsField as TsUnion;
  }

  public get InterfaceName(): string {
    return `(${
      this.TsField.Members
        .map((member) => member.ToCodeModel(this).InterfaceName)
        .join(' | ')
    })`;
  }

  public SelfCodeModels(): CodeModel[] {
    const result: CodeModel[] = [];
    this.TsField.Members.forEach((member) => {
      result.push(
        ...member.ToCodeModel(this).SelfCodeModels()
      );
    });
    return result;
  }
}

// review 2021年07月29日10:28:58
