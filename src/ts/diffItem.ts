import { TsField } from './tsField';

export enum DiffType {
  Modify = 'modify',
  Add = 'add',
  Delete = 'delete',
}

export class DiffItem {
  constructor(
    private type: DiffType,
    private oldTsField: TsField,
    private newTsField: TsField,
  ) { }

  public get Type() {
    return this.type;
  }

  public get OldTsField() {
    return this.oldTsField;
  }

  public get NewTsField() {
    return this.newTsField;
  }
}
