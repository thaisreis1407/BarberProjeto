require('dotenv/config');

export default {
  connectionName: 'barber',
  dialect: 'postgres',
  timezone: '-03:00',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || '',
  port: Number(process.env.DB_PORT || '5432'),
  logging: process.env.NODE_ENV === 'development',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    useUTC: false,
  },
  hooks: {},
};
