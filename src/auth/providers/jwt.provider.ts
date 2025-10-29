import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtRefreshPayload } from '../interfaces/jwt-payload.interface';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { BcryptProvider } from './bcrypt.provider';

@Injectable()
export class JwtProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  public generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  public async generateAndPersistRefreshToken(payload: JwtRefreshPayload): Promise<string> {
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET')!;
    const refreshTokenExpiresInSeconds = parseInt(
      this.configService.get('JWT_REFRESH_EXPIRES_IN')!,
    );
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInSeconds * 1000);

    const refreshToken = this.jwtService.sign(
      { id: payload.id, type: 'refresh' },
      {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpiresInSeconds,
      },
    );
    const refreshHash = await this.bcryptProvider.hash({ plainText: refreshToken });

    await this.refreshTokenRepository.save({
      userId: payload.id,
      tokenHash: refreshHash,
      isRevoked: false,
      expiresAt: refreshTokenExpiresAt,
    });

    return refreshToken;
  }
}
