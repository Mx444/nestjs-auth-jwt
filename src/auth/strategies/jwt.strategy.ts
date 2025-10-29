/** @format */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IsNull } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger('🔐 AUTH : JWT-Strategy');

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });

    this.logger.log('Initialized');
  }

  public async validate(payload: JwtPayload) {
    this.validatePayload(payload);
    const user = await this.findUserById(payload.id);
    this.ensureUserExists(user);
    return this.sanitizeUser(user);
  }

  private validatePayload(payload: JwtPayload) {
    if (!payload || !payload.id || !payload.email) {
      this.logger.warn(`Invalid payload`);
      throw new UnauthorizedException('Invalid token payload');
    }
    this.logger.log(`Payload validated for user ID: ${payload.id}`);
  }

  private async findUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId, deletedAt: IsNull() } });
    this.logger.log(`Validating JWT for user ID: ${user?.id}`);
    return user;
  }

  private ensureUserExists(user: User | null): asserts user is User {
    if (!user) {
      this.logger.warn(`User not found`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private sanitizeUser(user: User): Omit<User, 'password' | 'deletedAt'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __, deletedAt: ___, ...result } = user;
    this.logger.log(`User validated successfully`);
    return result;
  }
}
