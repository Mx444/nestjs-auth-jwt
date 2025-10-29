/** @format */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { IsNull } from 'typeorm';

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
      issuer: configService.get<string>('JWT_ISSUER')!,
      audience: configService.get<string>('JWT_AUDIENCE')!,
    });

    this.logger.log('🔑 JWT-STRATEGY : Initialized');
  }

  public async validate(payload: JwtPayload) {
    this.validatePayload(payload);
    const user = await this.findUserById(payload.id);
    this.ensureUserExists(user);
    return this.sanitizeUser(user);
  }

  private validatePayload(payload: JwtPayload) {
    if (!payload || !payload.id || !payload.email) {
      this.logger.warn(`🚨 JWT-STRATEGY : Invalid payload`);
      throw new UnauthorizedException('Invalid token payload');
    }
    this.logger.log(`✅ JWT-STRATEGY : Payload validated for user ID: ${payload.id}`);
  }

  private async findUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId, deletedAt: IsNull() } });
    this.logger.log(`🚨 JWT-STRATEGY : Validating JWT for user ID: ${user?.id}`);
    return user;
  }

  private ensureUserExists(user: User | null): asserts user is User {
    if (!user) {
      this.logger.warn(`🚨 JWT-STRATEGY : User not found`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __, ...result } = user;
    this.logger.log(`✅ JWT-STRATEGY : User validated successfully`);
    return result;
  }
}
