import { JsFactory } from '../js/jsFactory';

export function JS(data: any, name: string = 'something') {
  return JsFactory.Create(name, data);
}

export function TS(data: any, name: string = 'something') {
  return JS(data, name).ToTs();
}

export function TSCode(data: any, name: string = 'something') {
  return TS(data, name).ToCodeModel();
}

// review 2021年07月26日18:15:07
