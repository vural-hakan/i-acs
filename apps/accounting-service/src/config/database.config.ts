import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import './configuration';

const migrationDir = path.resolve(__dirname, '../migrations');
const moduleDir = path.resolve(__dirname, '../modules');

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrationsRun: false,
  synchronize: false,
  entities: [moduleDir + '/**/*.entity.{ts,js}'],
  migrations: [migrationDir + '/*.{ts,js}'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default databaseConfig;
