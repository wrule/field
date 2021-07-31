import { JsField } from '../js/jsField';
import { EType } from '../type';
import { TsField } from './tsField';
import { TsUnion } from './tsUnion';

/**
 * 包含判断的前置处理方法装饰器工厂
 * @returns 方法装饰器
 */
export function BeforeContain() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as TsField;
      const tsField = args[0] as TsField;
      if (
        tsField.Type === EType.Unknown ||
        that.Type === EType.Unknown
      ) {
        return false;
      }
      if (tsField.Hash() === that.Hash()) {
        return true;
      }
      if (tsField.Type === EType.Union) {
        const unionField = tsField as TsUnion;
        // B的所有成员皆被A包含
        return unionField.Members
          .every((member) => that.Contain(member));
      }
      const result = original.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
// review 2021年07月27日11:33:42

/**
 * 比较运算的前置处理方法装饰器工厂
 * @returns 方法装饰器
 */
export function BeforeCompare() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as TsField;
      const tsField = args[0] as TsField;
      if (
        tsField.Type === EType.Unknown ||
        that.Type === EType.Unknown
      ) {
        return 0;
      }
      if (tsField.Hash() === that.Hash()) {
        return 1;
      }
      if (
        tsField.Type === EType.Union &&
        that.Type !== EType.Union
      ) {
        return tsField.Compare(that);
      }
      const result = original.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
// review 2021年07月27日11:41:01

/**
 * 合并操作的前置处理方法装饰器工厂
 * @returns 方法装饰器
 */
export function BeforeMerge() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as TsField;
      const tsField = args[0] as TsField;
      if (tsField.Hash() === that.Hash()) {
        return that.Clone();
      }
      if (that.Contain(tsField)) {
        return that.Clone();
      }
      if (tsField.Type === EType.Unknown) {
        return that.Clone();
      }
      if (
        tsField.Type === EType.Array &&
        that.Type === EType.Tuple
      ) {
        return tsField.Clone(that.Name).Merge(that);
      }
      if (
        tsField.Type === EType.Union &&
        that.Type !== EType.Union
      ) {
        return tsField.Clone(that.Name).Merge(that);
      }
      const result = original.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
// review 2021年07月27日11:47:26

/**
 * 定义判断的前置处理方法装饰器工厂
 * @returns 方法装饰器
 */
export function BeforeDefineJsField() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as TsField;
      const jsField = args[0] as JsField;
      if (
        jsField.Type === EType.Unknown ||
        that.Type === EType.Unknown
      ) {
        return false;
      }
      if (jsField.Hash() === that.Hash()) {
        return true;
      }
      const result = original.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
// review 2021年07月27日12:42:28

/**
 * 更新操作的前置处理方法装饰器工厂
 * @returns 方法装饰器
 */
export function BeforeUpdateJsField() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as TsField;
      const jsField = args[0] as JsField;
      if (jsField.Type === EType.Unknown) {
        return that.Clone();
      }
      if (that.DefineJsField(jsField)) {
        return that.Clone();
      }
      const result = original.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
// review 2021年07月27日12:55:39
// review 2021年07月28日10:19:57
