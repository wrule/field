import { CodeModel } from './codeModel';
import { TsUnknown } from '../tsUnknown';

export class CodeUnknown extends CodeModel {
  constructor(
    tsField: TsUnknown,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsUnknown {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'any';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:34
