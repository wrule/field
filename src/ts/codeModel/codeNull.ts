import { CodeModel } from './codeModel';
import { TsNull } from '../tsNull';

export class CodeNull extends CodeModel {
  constructor(
    tsField: TsNull,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsNull {
    return this.tsField;
  }

  public get InterfaceName(): string {
    return 'null';
  }

  public SelfCodeModels(): CodeModel[] {
    return [];
  }
}

// review 2021年07月29日10:17:07
