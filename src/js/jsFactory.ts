import { JsUndefined } from './jsUndefined';
import { JsNull } from './jsNull';
import { JsBoolean } from './jsBoolean';
import { JsNumber } from './jsNumber';
import { JsString } from './jsString';
import { JsDate } from './jsDate';
import { JsUnknown } from './jsUnknown';
import { JsObject } from './jsObject';
import { JsArray } from './jsArray';
import { JsField } from './jsField';

export class JsFactory {
  public static Create(name: string, value: any): JsField {
    const protoName = Object.prototype.toString.call(value);
    switch (protoName) {
      case '[object Undefined]':
        return new JsUndefined(name);
      case '[object Null]':
        return new JsNull(name);
      case '[object Boolean]':
        return new JsBoolean(name);
      case '[object Number]':
        return new JsNumber(name);
      case '[object String]':
        return new JsString(name);
      case '[object Date]':
        return new JsDate(name);
      case '[object Object]': {
        const fieldsMap = new Map<string, JsField>(
          Object.entries(value)
            .map(
              ([fieldName, fieldValue]) =>
                [fieldName, JsFactory.Create(fieldName, fieldValue)]
            )
        );
        return new JsObject(name, fieldsMap);
      }
      case '[object Array]': {
        const elements = (value as any[]);
        return new JsArray(
          name,
          elements.map(
            (element, index) =>
              JsFactory.Create(`element${index}`, element)
          ),
        );
      }
    }
    return new JsUnknown(name);
  }
}

// review 2021年07月26日18:05:57
