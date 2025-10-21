import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
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
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
