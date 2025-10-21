/** @format */

import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST_DEV || 'localhost',
  port: Number(process.env.DB_PORT_DEV) || 5432,
  username: process.env.DB_USERNAME_DEV || 'postgres',
  password: process.env.DB_PASSWORD_DEV || 'postgres',
  database: process.env.DB_NAME_DEV || 'nestjs_auth',
  entities: [
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '../**/*.entity.js')
      : join(__dirname, '../**/*.entity.ts'),
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '../database/migrations/*.js')
      : join(__dirname, '../database/migrations/*.ts'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
