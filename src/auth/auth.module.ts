/** @format */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './providers/auth.service';
import { JwtProvider } from './providers/jwt.provider';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET')!,
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN')!,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Providers
    AuthService,
    BcryptProvider,
    JwtProvider,

    // Strategies
    JwtStrategy,

    // Repositories
    UserRepository,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
