require('dotenv').config();

const defaultConnection =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/taylormade';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './src/db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

module.exports = {
  development: {
    ...baseConfig,
    connection: defaultConnection,
  },
  test: {
    ...baseConfig,
    connection: process.env.TEST_DATABASE_URL || defaultConnection,
  },
  production: {
    ...baseConfig,
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
  },
};
