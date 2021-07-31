import { EType } from '../../type';
import { UpperFirst } from '../../utils';
import { TsField } from '../tsField';
import { CodeObject } from './codeObject';

/**
 * 代码定义模型的抽象类
 */
export abstract class CodeModel {
  /**
   * 构造函数
   * @param tsField 模型的源ts字段
   * @param parent 父模型，可选项，不传则为根模型
   */
  constructor(
    protected tsField: TsField,
    protected parent?: CodeModel,
  ) { }

  /**
   * UpperFirst传入名称
   * @param name 传入名称
   * @param defaultName 为空的时候取得默认名称
   * @returns UpperFirst之后的名称
   */
  private upperFirstName(
    name: string,
    defaultName: string,
  ) {
    return UpperFirst(name.trim()) || UpperFirst(defaultName);
  }

  /**
   * 模型的类型
   */
  public get Type() {
    return this.tsField.Type;
  }

  /**
   * 模型的名称
   */
  public get Name(): string {
    const defaultName = 'something';
    if (this.parent) {
      // 这三种模型的直接子模型需要加上父模型名称前缀
      if (
        this.parent.Type === EType.Array ||
        this.parent.Type === EType.Tuple ||
        this.parent.Type === EType.Union
      ) {
        return `${
          this.parent.Name
        }${
          this.upperFirstName(this.tsField.Name, defaultName)
        }`;
      }
    }
    return this.tsField.Name.trim() || defaultName;
  }

  /**
   * 模型的模块名称
   */
  public get ModuleName() {
    return UpperFirst(this.Name);
  }

  /**
   * 模型的父模型
   */
  public get Parent() {
    return this.parent;
  }

  /**
   * 获取父级最近的CodeObject
   * @returns 父级最近的CodeObject
   */
  public ParentObjectCodeModel(): CodeObject | undefined {
    let result = this.parent;
    while (result && result.Type !== EType.Object) {
      result = result.parent;
    }
    return result as CodeObject | undefined;
  }

  /**
   * 获取代码模型的源ts字段
   */
  abstract TsField: TsField;
  /**
   * 代码模型的接口名称
   */
  abstract InterfaceName: string;
  /**
   * 代码模型的接口定义代码
   */
  public DefineCode(): string {
    const moduleCodeModels = this.ModuleCodeModels();
    if (moduleCodeModels.length < 1) {
      return '';
    }
    const defineCode = moduleCodeModels
      .map((codeModel) => codeModel.DefineCode().trim())
      .join('\n\n');
    return defineCode.trim() + '\n';
  }
  /**
   * 获取直接描述当前接口的模型
   */
  abstract SelfCodeModels(): CodeModel[];
  /**
   * 获取模块内所有描述当前模型的模型
   * CodeObject需要覆盖此方法检索字段的模型
   * @returns 
   */
  public ModuleCodeModels(): CodeModel[] {
    return this.SelfCodeModels();
  }
}

// review 2021年07月29日10:10:41
