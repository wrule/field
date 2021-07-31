import { CodeModel } from './codeModel';
import { TsDate } from '../tsDate';

export class CodeDate extends CodeModel {
  constructor(
    tsField: TsDate,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsDate {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'Date';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:01
