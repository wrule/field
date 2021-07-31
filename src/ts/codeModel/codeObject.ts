import { CodeModel } from './codeModel';
import { TsObject } from '../tsObject';

export class CodeObject extends CodeModel {
  constructor(
    tsField: TsObject,
    parent?: CodeModel,
  ) {
    super(tsField, parent);
  }

  public get TsField(): TsObject {
    return this.tsField as TsObject;
  }

  /**
   * 自然的，不包含上下文信息的接口名称
   */
  public get NatureInterfaceName() {
    return `I${this.ModuleName}`;
  }

  public get InterfaceName(): string {
    const objectCodeModel = this.ParentObjectCodeModel();
    if (objectCodeModel) {
      return `${objectCodeModel.ModuleName}.${this.NatureInterfaceName}`;
    }
    return this.NatureInterfaceName;
  }

  public DefineCode() {
    let result = this.InterfaceDefineCode;
    const moduleCode = this.ModuleDefineCode;
    if (moduleCode.trim()) {
      result += `\n\n${moduleCode}`;
    }
    return result + '\n';
  }

  /**
   * 接口定义部分代码
   */
  public get InterfaceDefineCode(): string {
    return `
//#region ${this.NatureInterfaceName}接口定义
export interface ${this.NatureInterfaceName} {
${
  this.TsField.Fields
    .map(
      (field) =>
        `  ['${field.Name}']: ${field.ToCodeModel(this).InterfaceName};`
    )
    .concat(['  [propName: string]: any;'])
    .join('\n')
}
}
//#endregion 
    `.trim();
  }

  /**
   * 模块定义部分代码
   */
  public get ModuleDefineCode() {
    const defineCode = super.DefineCode().trim()
      .split('\n')
      .map((line) => `  ${line}`)
      .map((line) => line.trim() ? line : '')
      .join('\n')
      .trim();
    if (defineCode) {
      return `
//#region ${this.ModuleName}模块定义，此模块包含上文接口下所有子级接口定义
export module ${this.ModuleName} {
${defineCode}
}
//#endregion
      `.trim();
    }
    return '';
  }

  public SelfCodeModels(): CodeModel[] {
    return [this];
  }

  /**
   * 覆盖实现模块内的CodeModel列表
   * @returns CodeModel列表
   */
   public ModuleCodeModels(): CodeModel[] {
    const result: CodeModel[] = [];
    this.TsField.Fields.forEach((field) => {
      result.push(...field.ToCodeModel(this).SelfCodeModels());
    });
    return result;
  }
}
