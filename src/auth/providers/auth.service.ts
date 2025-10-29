/** @format */

import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../dtos/base-auth.dto';

import { IsNull } from 'typeorm/find-options/operator/IsNull';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';
import { BcryptProvider } from './bcrypt.provider';
import { JwtProvider } from './jwt.provider';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('🔐 AuthService');

  constructor(
    private readonly bcryptProvider: BcryptProvider,
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async register(registerDTO: RegisterDTO): Promise<RegisterResponse> {
    await this.validateUserUniqueness(registerDTO.email);
    await this.persistUser(registerDTO);
    return this.createRegisterResponse();
  }

  private async validateUserUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`🚨 Validate User Uniqueness : Registration attempt blocked`);
      throw new BadRequestException('Unable to process your registration request');
    }
  }

  private async persistUser(registerDTO: RegisterDTO): Promise<void> {
    const hashedPassword = await this.bcryptProvider.hashPassword({
      password: registerDTO.password,
    });

    const user = this.userRepository.create({
      ...registerDTO,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    this.logger.log(`✅ Persist User : User with email ${registerDTO.email} registered`);
  }

  private createRegisterResponse(): RegisterResponse {
    return {
      message: 'User registered successfully',
      statusCode: 201,
    };
  }

  public async login(loginDTO: LoginDTO): Promise<LoginResponse> {
    const user = await this.validateUser(loginDTO);
    const tokens = await this.generateAndPersistTokens(user);
    return this.createLoginResponse(tokens.accessToken, tokens.refreshToken);
  }

  private async validateUser(loginDTO: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: { email: loginDTO.email, deletedAt: IsNull() },
    });

    if (!user) {
      this.logger.warn(`🚨 Validate User : Login attempt failed - user not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.verifyPassword(loginDTO.password, user.password);
    return { id: user.id, email: user.email };
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordValid = await this.bcryptProvider.comparePasswords({
      password: plainPassword,
      hashedPassword,
    });

    if (!isPasswordValid) {
      this.logger.warn(`🚨 Verify Password : Login attempt failed - invalid password`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async generateAndPersistTokens(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { id, email } = payload;
    const accessToken = this.jwtProvider.generateAccessToken({ id, email });

    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshToken = this.jwtProvider.generateRefreshToken({ id, type: 'refresh' });
    const refreshTokenHash = await this.bcryptProvider.hashPassword({ password: refreshToken });

    await this.refreshTokenRepository.save({
      userId: id,
      tokenHash: refreshTokenHash,
      isRevoked: false,
      expiresAt: sevenDaysFromNow,
    });

    return { accessToken, refreshToken };
  }

  private createLoginResponse(accessToken: string, refreshToken: string): LoginResponse {
    return {
      message: 'Login successful',
      statusCode: 200,
      accessToken,
      refreshToken,
    };
  }
}
