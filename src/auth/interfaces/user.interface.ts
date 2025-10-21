/* eslint-disable @typescript-eslint/no-empty-object-type */
import { BaseInterfaceRepository } from '../../database/interfaces/base.interface';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
