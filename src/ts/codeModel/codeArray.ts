import { CodeModel } from './codeModel';
import { TsArray } from '../tsArray';

export class CodeArray extends CodeModel {
  constructor(
    tsField: TsArray,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsArray {
    return this.tsField as TsArray;
  }

  public get InterfaceName(): string {
    return `${
      this.TsField.Element
        .ToCodeModel(this)
        .InterfaceName
    }[]`;
  }

  public SelfCodeModels(): CodeModel[] {
    return [
      ...this.TsField.Element.ToCodeModel(this).SelfCodeModels()
    ];
  }
}

// review 2021年07月29日10:25:50
