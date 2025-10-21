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
    this.logger = new Logger(
      context || `📊 DATABASE:${entity.metadata.name}-Repository`,
    );
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    try {
      const saved = await this.entity.save(data);
      this.logger.log(`✅ Item saved successfully`);
      return saved;
    } catch (error) {
      this.handleError('saving', error);
      throw error;
    }
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      const saved = await this.entity.save(data);
      this.logger.log(`✅ ${saved.length} items saved successfully`);
      return saved;
    } catch (error) {
      this.handleError('batch saving', error);
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
        this.logger.warn(`⚠️ Item with id ${id} not found`);
      }

      return result;
    } catch (error) {
      this.handleError(`finding item with id ${id}`, error);
      throw error;
    }
  }

  public async findByCondition(
    filterCondition: FindOneOptions<T>,
  ): Promise<T | null> {
    try {
      return await this.entity.findOne(filterCondition);
    } catch (error) {
      this.handleError('finding by condition', error);
      throw error;
    }
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(relations);
    } catch (error) {
      this.handleError('finding with relations', error);
      throw error;
    }
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(options);
    } catch (error) {
      this.handleError('finding all items', error);
      throw error;
    }
  }

  public async remove(data: T): Promise<T> {
    try {
      const removed = await this.entity.remove(data);
      this.logger.log(`✅ Item with id ${data.id} deleted successfully`);
      return removed;
    } catch (error) {
      this.handleError(`deleting item with id ${data.id}`, error);
      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.entity.delete(id);
      this.logger.log(`✅ Item with id ${id} deleted successfully`);
    } catch (error) {
      this.handleError(`deleting item with id ${id}`, error);
      throw error;
    }
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
    try {
      return await this.entity.preload(entityLike);
    } catch (error) {
      this.handleError('preloading entity', error);
      throw error;
    }
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | null> {
    try {
      return await this.entity.findOne(options);
    } catch (error) {
      this.handleError('finding one item', error);
      throw error;
    }
  }

  public async upsert(
    data: DeepPartial<T>,
    uniqueWhere?: FindOptionsWhere<T>,
  ): Promise<T> {
    try {
      if (uniqueWhere) {
        const existing = await this.entity.findOneBy(uniqueWhere);

        if (existing) {
          const merged = this.entity.merge(existing, data);
          const updated = await this.entity.save(merged);
          this.logger.log(`✅ Item updated successfully`);
          return updated;
        }
      }

      const dataWithId = data as T;
      if (dataWithId.id) {
        const existing = await this.findOneById(dataWithId.id);
        if (existing) {
          const merged = this.entity.merge(existing, data);
          const updated = await this.entity.save(merged);
          this.logger.log(`✅ Item with id ${dataWithId.id} updated`);
          return updated;
        }
      }

      const created = await this.entity.save(data);
      this.logger.log(`✅ Item created successfully`);
      return created;
    } catch (error) {
      this.handleError('upserting item', error);
      throw error;
    }
  }

  public async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.entity.count(options);
    } catch (error) {
      this.handleError('counting items', error);
      throw error;
    }
  }

  public async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    try {
      const count = await this.entity.countBy(where);
      return count > 0;
    } catch (error) {
      this.handleError('checking existence', error);
      throw error;
    }
  }

  protected handleError(operation: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`💥 Error ${operation}: ${errorMessage}`);
  }
}
