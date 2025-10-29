/** @format */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { BaseAbstractRepostitory } from 'src/database/repository/abstract.repository';
import { IsNull, Repository } from 'typeorm';
import { UserRepositoryInterface } from '../interfaces/user.interface';

@Injectable()
export class UserRepository
  extends BaseAbstractRepostitory<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly userEntity: Repository<User>,
  ) {
    super(userEntity, '👤 AUTH:User-Repository');
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.findOne({
        where: {
          email,
          deletedAt: IsNull(),
        },
      });
    } catch (error) {
      this.handleError(`finding user by email ${email}`, error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({
      email,
      deletedAt: IsNull(),
    });
  }
}
