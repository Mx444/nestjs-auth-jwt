import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { BaseAbstractRepostitory } from 'src/database/repository/abstract.repository';
import { Repository } from 'typeorm/repository/Repository';
import { UserRepositoryInterface } from '../interfaces/user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository
  extends BaseAbstractRepostitory<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly userEntity: Repository<User>,
  ) {
    super(userEntity);
  }
}
