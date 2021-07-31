import { CodeModel } from './codeModel';
import { TsNumber } from '../tsNumber';

export class CodeNumber extends CodeModel {
  constructor(
    tsField: TsNumber,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsNumber {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'number';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:14
