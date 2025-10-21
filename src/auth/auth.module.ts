/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BcryptProvider } from 'src/auth/providers/bcrypt.provider';
import { AuthService } from './providers/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './repositories/user.repository';

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

    // Strategies
    JwtStrategy,

    // Repositories
    UserRepository,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
