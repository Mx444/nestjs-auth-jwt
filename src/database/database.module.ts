import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from '../auth/repositories/user.repository';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host:
          configService.get('NODE_ENV') === 'development'
            ? configService.get('DB_HOST_DEV')
            : configService.get('DB_HOST_PROD'),
        port: Number(
          configService.get('NODE_ENV') === 'development'
            ? configService.get('DB_PORT_DEV')
            : configService.get('DB_PORT_PROD'),
        ),
        username:
          configService.get('NODE_ENV') === 'development'
            ? configService.get('DB_USERNAME_DEV')
            : configService.get('DB_USERNAME_PROD'),
        password:
          configService.get('NODE_ENV') === 'development'
            ? configService.get('DB_PASSWORD_DEV')
            : configService.get('DB_PASSWORD_PROD'),
        database:
          configService.get('NODE_ENV') === 'development'
            ? configService.get('DB_NAME_DEV')
            : configService.get('DB_NAME_PROD'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/database/migrations',
        },
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule.forFeature([User]), UserRepository],
  providers: [UserRepository],
})
export class DatabaseModule {}
