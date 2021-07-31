import { CodeModel } from './codeModel';
import { TsString } from '../tsString';

export class CodeString extends CodeModel {
  constructor(
    tsField: TsString,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsString {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'string';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:21
