import { Field } from '../proto/field';
import { ObjectField } from '../proto/object';
import { ModelUtils } from '../ts/modelUtils';
import { TsField } from '../ts/tsField';

export class Common {
  public static Clone(
    tsField: TsField,
    name?: string,
  ): TsField {
    const model = tsField.ToModel();
    if (name !== undefined) {
      model.name = name;
    }
    return ModelUtils.Load(model);
  }

  public static AllFieldNames(
    field1: ObjectField,
    field2: ObjectField,
  ): string[] {
    return Array.from(new Set(
      field1.Fields
        .map((field) => field.Name)
        .concat(
          field2.Fields.map((field) => field.Name)
        )
    ));
  }

  public static MaxLength(
    fields1: Field[],
    fields2: Field[],
  ) {
    const length1 = fields1.length;
    const length2 = fields2.length;
    return length1 >= length2 ? length1 : length2;
  }
}
