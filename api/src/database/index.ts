import 'reflect-metadata';
import { createConnection } from 'typeorm';

import configDb from '../config/database';

createConnection({
  name: configDb.connectionName,
  type: 'postgres',
  host: configDb.host,
  port: configDb.port,
  username: configDb.username,
  password: configDb.password,
  database: configDb.database,
  entities: [
    `${__dirname}/../app/models/*.ts`,
    `${__dirname}/../app/models/*.js`,
    `${__dirname}/../app/models/views/*.ts`,
    `${__dirname}/../app/models/views/*.js`,
  ],
  synchronize: false,
  logging: configDb.logging,
  useUTC: false,
});
