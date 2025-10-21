/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  public async validate(payload: JwtPayload) {
    const user = await this.findUserById(payload.sub);
    this.ensureUserExists(user);
    return this.sanitizeUser(user);
  }

  private async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  private ensureUserExists(user: User | null): asserts user is User {
    if (!user) throw new UnauthorizedException('User not found');
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __, ...result } = user;
    return result;
  }
}
