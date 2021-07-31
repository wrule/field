import { EType } from '../type';

/**
 * 定义ts字段持久化存储模型接口
 */
export interface IModel {
  name: string;
  type: EType;
  children?: IModel[];
  path?: string;
}

// review 2021年07月27日13:01:47
