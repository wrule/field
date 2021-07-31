import { Field } from '../proto/field';
import { TsBoolean } from '../ts/tsBoolean';
import { EType } from '../type';
import { JsField } from './jsField';

export class JsBoolean extends Field implements JsField {
  constructor(name: string) {
    super(name, EType.Boolean);
  }

  public ToTs() {
    return new TsBoolean(this.Name);
  }
}

// review 2021年07月26日17:42:19
