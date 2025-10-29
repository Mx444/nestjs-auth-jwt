/** @format */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { BaseAbstractRepostitory } from 'src/database/repository/abstract.repository';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from '../interfaces/user.interface';

@Injectable()
export class UserRepository
  extends BaseAbstractRepostitory<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, '👤 AUTH:User-Repository');
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: {
          email,
        },
        withDeleted: true,
      });
    } catch (error) {
      this.handleError(`finding user by email ${email}`, error);
      throw error;
    }
  }
}
