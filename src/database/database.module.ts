/** @format */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        return {
          type: 'postgres',
          host: isDevelopment
            ? configService.get('DB_HOST_DEV')
            : configService.get('DB_HOST_PROD'),
          port: Number(
            isDevelopment
              ? configService.get('DB_PORT_DEV')
              : configService.get('DB_PORT_PROD'),
          ),
          username: isDevelopment
            ? configService.get('DB_USERNAME_DEV')
            : configService.get('DB_USERNAME_PROD'),
          password: isDevelopment
            ? configService.get('DB_PASSWORD_DEV')
            : configService.get('DB_PASSWORD_PROD'),
          database: isDevelopment
            ? configService.get('DB_NAME_DEV')
            : configService.get('DB_NAME_PROD'),
          entities: [
            configService.get('NODE_ENV') === 'production'
              ? join(__dirname, '../**/*.entity.js')
              : join(__dirname, '../**/*.entity.ts'),
          ],
          migrations: [
            configService.get('NODE_ENV') === 'production'
              ? join(__dirname, './migrations/*.js')
              : join(__dirname, './migrations/*.ts'),
          ],
          synchronize: false,
          logging: isDevelopment,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule.forFeature([User])],
})
export class DatabaseModule {}
