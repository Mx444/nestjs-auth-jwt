/** @format */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepostitory } from 'src/database/repository/abstract.repository';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/token.entity';
import { RefreshTokenInterface } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenRepository
  extends BaseAbstractRepostitory<RefreshToken>
  implements RefreshTokenInterface
{
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super(refreshTokenRepository, '👤 AUTH:RefreshToken-Repository');
  }
}
