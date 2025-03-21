import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig } from './envs';

export const databaseProviders: TypeOrmModuleOptions = {
  type: 'postgres',
  // type: 'mysql',
  host: envConfig.HOST,
  port: envConfig.DB_PORT || 3306,
  database: envConfig.DB_NAME,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD || '',
  autoLoadEntities: true, // Carga las entidades automáticamente
  synchronize: true,
  logging: envConfig.NODE_ENV != 'production', // Activa los logs de TypeORM cuando el entrono no es de producción
  ssl: { rejectUnauthorized: false },
};