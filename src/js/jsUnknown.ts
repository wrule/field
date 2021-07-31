import { Field } from '../proto/field';
import { TsUnknown } from '../ts/tsUnknown';
import { EType } from '../type';
import { JsField } from './jsField';

export class JsUnknown extends Field implements JsField {
  constructor(name: string) {
    super(name, EType.Unknown);
  }

  public ToTs() {
    return new TsUnknown(this.Name);
  }
}

// review 2021年07月26日17:49:45
