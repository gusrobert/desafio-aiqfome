import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

// Compatível com CommonJS (build) e com execução via ts-node-esm (ESM):
// - Em runtime CommonJS, __dirname existe.
// - Em ESM, typeof __dirname === 'undefined' (typeof evita ReferenceError).
const isCompiled =
  (typeof __dirname !== 'undefined' && __dirname.includes('dist')) ||
  process.env.NODE_ENV === 'production';

const baseDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const entitiesPath = isCompiled
  ? `${baseDir}/entities/*{.js}`
  : `${baseDir}/src/entities/*{.ts,.js}`;

const migrationsPath = isCompiled
  ? `${baseDir}/migrations/*{.js}`
  : `${baseDir}/src/migrations/*{.ts,.js}`;

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'aiqfome',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
});
