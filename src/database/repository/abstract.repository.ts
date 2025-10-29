/** @format */

import { Logger } from '@nestjs/common';
import { BaseInterfaceRepository } from 'src/database/interfaces/base.interface';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepostitory<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  protected readonly logger: Logger;
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>, context?: string) {
    this.entity = entity;
    this.logger = new Logger(context || `📊 DATABASE:${entity.metadata.name}-Repository`);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    try {
      const saved = await this.entity.save(data);
      this.logger.log(`✅ Save : Item saved successfully`);
      return saved;
    } catch (error) {
      this.handleError('Save', error);
      throw error;
    }
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      const saved = await this.entity.save(data);
      this.logger.log(`✅ Save Many : ${saved.length} items saved successfully`);
      return saved;
    } catch (error) {
      this.handleError('Batch Save', error);
      throw error;
    }
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: number): Promise<T | null> {
    try {
      const options: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
      const result = await this.entity.findOneBy(options);

      if (!result) {
        this.logger.warn(`⚠️ Find One By ID : Item with id ${id} not found`);
      }

      return result;
    } catch (error) {
      this.handleError(`Find One By ID : ${id}`, error);
      throw error;
    }
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.entity.findOne(filterCondition);
    } catch (error) {
      this.handleError('Find By Condition', error);
      throw error;
    }
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(relations);
    } catch (error) {
      this.handleError('Find With Relations', error);
      throw error;
    }
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(options);
    } catch (error) {
      this.handleError('Find All', error);
      throw error;
    }
  }

  public async remove(data: T): Promise<T> {
    try {
      const removed = await this.entity.remove(data);
      this.logger.log(`✅ Remove : Item with id ${data.id} deleted successfully`);
      return removed;
    } catch (error) {
      this.handleError(`Delete : ${data.id}`, error);
      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.entity.delete(id);
      this.logger.log(`✅ Delete : Item with id ${id} deleted successfully`);
    } catch (error) {
      this.handleError(`Delete : ${id}`, error);
      throw error;
    }
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
    try {
      return await this.entity.preload(entityLike);
    } catch (error) {
      this.handleError('Preload', error);
      throw error;
    }
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.entity.findOne(options);
    } catch (error) {
      this.handleError('Find One', error);
      throw error;
    }
  }

  public async upsert(data: DeepPartial<T>, uniqueWhere?: FindOptionsWhere<T>): Promise<T> {
    try {
      if (uniqueWhere) {
        const existing = await this.entity.findOneBy(uniqueWhere);

        if (existing) {
          const merged = this.entity.merge(existing, data);
          const updated = await this.entity.save(merged);
          this.logger.log(`✅ Upsert : Item updated successfully`);
          return updated;
        }
      }

      const dataWithId = data as T;
      if (dataWithId.id) {
        const existing = await this.findOneById(dataWithId.id);
        if (existing) {
          const merged = this.entity.merge(existing, data);
          const updated = await this.entity.save(merged);
          this.logger.log(`✅ Upsert : Item with id ${dataWithId.id} updated`);
          return updated;
        }
      }

      const created = await this.entity.save(data);
      this.logger.log(`✅ Upsert : Item created successfully`);
      return created;
    } catch (error) {
      this.handleError('Upsert', error);
      throw error;
    }
  }

  public async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.entity.count(options);
    } catch (error) {
      this.handleError('Count', error);
      throw error;
    }
  }

  public async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    try {
      const count = await this.entity.countBy(where);
      return count > 0;
    } catch (error) {
      this.handleError('Exists', error);
      throw error;
    }
  }

  protected handleError(operation: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`💥 Handle Error : ${operation}: ${errorMessage}`);
  }
}
