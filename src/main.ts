import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('🔐 AUTH-API');

async function bootstrap() {
  try {
    logger.log('🚀 Initializing Authentication API...');
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

    logger.log('✅ AUTH-API successfully started and ready for requests');
    logger.log(`📡 AUTH-API listening on: http://localhost:${port}`);
    logger.log('🎯 AUTH-API handles: login, register, JWT authentication');
    logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('💥 AUTH-API startup failed:', error.message);
      logger.error('🔍 AUTH-API error stack:', error.stack);
    } else {
      logger.error('💥 AUTH-API startup failed:', error);
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

  logger.log('⚙️ AUTH-API global validation pipes configured');
}

function setupGracefulShutdown(app: INestApplication) {
  const gracefulShutdown = (signal: string) => {
    logger.log(
      `🛑 AUTH-API received ${signal}, initiating graceful shutdown...`,
    );

    app
      .close()
      .then(() => {
        logger.log('✅ AUTH-API shut down gracefully - all connections closed');
        process.exit(0);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          logger.error('❌ AUTH-API shutdown error:', error.message);
        } else {
          logger.error('❌ AUTH-API shutdown error:', error);
        }
        process.exit(1);
      });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (error) => {
    logger.error('💥 AUTH-API uncaught exception:', error.message);
    logger.error('🔍 AUTH-API stack trace:', error.stack);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 AUTH-API unhandled rejection at:', promise);
    logger.error('🔍 AUTH-API reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  logger.log('🛡️ AUTH-API graceful shutdown handlers configured');
}

function logHealthInfo() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  logger.log('📊 AUTH-API health metrics:');
  logger.log(
    `   💾 Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
  );
  logger.log(`   ⏱️ Uptime: ${Math.round(uptime)}s`);
  logger.log(`   🔐 Auth API: operational`);
}

if (process.env.NODE_ENV !== 'production') {
  setInterval(logHealthInfo, 5 * 60 * 1000);
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    logger.error('💥 AUTH-API critical bootstrap error:', error.message);
    logger.error('🔍 AUTH-API bootstrap stack trace:', error.stack);
  } else {
    logger.error('💥 AUTH-API critical bootstrap error:', error);
  }
  process.exit(1);
});
