/** @format */

import { BaseInterfaceRepository } from '../../database/interfaces/base.interface';
import { User } from '../entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
