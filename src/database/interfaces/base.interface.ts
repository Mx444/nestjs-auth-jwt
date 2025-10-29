/** @format */

import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string | number): Promise<T | null>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  delete(id: string | number): Promise<void>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T | undefined>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  upsert(data: DeepPartial<T>, uniqueWhere?: FindOptionsWhere<T>): Promise<T>;
  count(options?: FindManyOptions<T>): Promise<number>;
  exists(where: FindOptionsWhere<T>): Promise<boolean>;
}
