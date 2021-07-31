import { TS } from './index';
import { ModelUtils } from './ts/modelUtils';
import fs from 'fs';

const jsonObject = [
  { name: 'jimao', age: 17 },
  { name: 'jimao' },
  { age: 'jimao' }
];

const tsField = TS(jsonObject, 'jimao');
console.log(tsField.Hash());
const model = tsField.ToModel();
const list = ModelUtils.Flatten(model);
const models = ModelUtils.Pile(list);
const tsField2 = ModelUtils.Load(models[0]);
console.log(tsField2.Hash());

const code = tsField2.ToCodeModel();
console.log(code.InterfaceName);
fs.writeFileSync('./output/output.ts', code.DefineCode());
