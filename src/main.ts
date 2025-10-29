/** @format */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('🔐 AUTH-API');

async function bootstrap() {
  try {
    logger.log('Initializing Main...');
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);
    const port = configService.get<number>('NESTJS_PORT') || 3000;

    setupGlobalConfiguration(app);
    app.enableCors({
      origin: process.env.NODE_ENV === 'production' ? false : true,
      credentials: true,
    });
    setupGracefulShutdown(app);
    await app.listen(port);

    logger.log('Main successfully started and ready for requests');
    logger.log(`Main listening on: http://localhost:${port}`);
    logger.log('Main handles: login, register, JWT authentication');
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('💥 Main startup failed:', error.message);
      logger.error('🔍 Main error stack:', error.stack);
    } else {
      logger.error('💥 Main startup failed:', error);
    }
    process.exit(1);
  }
}

function setupGlobalConfiguration(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  logger.log('Main global validation pipes configured');
}

function setupGracefulShutdown(app: INestApplication) {
  const gracefulShutdown = (signal: string) => {
    logger.log(`Main received ${signal}, initiating graceful shutdown...`);

    app
      .close()
      .then(() => {
        logger.log('Main shut down gracefully - all connections closed');
        process.exit(0);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          logger.error('Main shutdown error:', error.message);
        } else {
          logger.error('Main shutdown error:', error);
        }
        process.exit(1);
      });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (error) => {
    logger.error('Main uncaught exception:', error.message);
    logger.error('Main stack trace:', error.stack);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Main unhandled rejection at:', promise);
    logger.error('Main reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  logger.log('Main graceful shutdown handlers configured');
}

function logHealthInfo() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  logger.log(' MAIN health metrics:');
  logger.log(`    Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
  logger.log(`    Uptime: ${Math.round(uptime)}s`);
  logger.log(`    Main: operational`);
}

if (process.env.NODE_ENV !== 'production') {
  setInterval(logHealthInfo, 5 * 60 * 1000);
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    logger.error('Main critical bootstrap error:', error.message);
    logger.error('Main bootstrap stack trace:', error.stack);
  } else {
    logger.error('Main critical bootstrap error:', error);
  }
  process.exit(1);
});
