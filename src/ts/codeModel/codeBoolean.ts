import { CodeModel } from './codeModel';
import { TsBoolean } from '../tsBoolean';

export class CodeBoolean extends CodeModel {
  constructor(
    tsField: TsBoolean,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsBoolean {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'boolean';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:16:53
