import { z } from 'zod';

export const envSchema = z.object({
  // Database development and production
  DB_HOST_DEV: z.string().default('localhost'),
  DB_PORT_DEV: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(5432),
  DB_USERNAME_DEV: z.string().default('postgres'),
  DB_PASSWORD_DEV: z.string().min(1),
  DB_NAME_DEV: z.string().default('nestjs_auth'),

  // Application
  NESTJS_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // JWT
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues.map(
      (err) => `${err.path.join('.')}: ${err.message}`,
    );
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return result.data;
}
