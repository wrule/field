import { CodeModel } from './codeModel';
import { TsUndefined } from '../tsUndefined';

export class CodeUndefined extends CodeModel {
  constructor(
    tsField: TsUndefined,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsUndefined {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'undefined';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:28
