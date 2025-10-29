import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtRefreshPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  public generateRefreshToken(payload: JwtRefreshPayload): string {
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET')!;
    const refreshTokenExpiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN')!;
    return this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpiresIn,
    });
  }
}
