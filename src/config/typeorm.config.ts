/** @format */

import { DataSource } from 'typeorm';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST_DEV || 'localhost',
  port: Number(process.env.DB_PORT_DEV) || 5432,
  username: process.env.DB_USERNAME_DEV || 'postgres',
  password: process.env.DB_PASSWORD_DEV || 'postgres',
  database: process.env.DB_NAME_DEV || 'nestjs_auth',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
