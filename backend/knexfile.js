require('dotenv').config();

const defaultConnection =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/taylormade';

const buildConnection = (connection) => {
  if (!connection) return connection;
  if (typeof connection === 'string' && connection.includes('sslmode=require')) {
    return {
      connectionString: connection,
      ssl: { rejectUnauthorized: false },
    };
  }
  return connection;
};

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
    connection: buildConnection(defaultConnection),
  },
  test: {
    ...baseConfig,
    connection: buildConnection(process.env.TEST_DATABASE_URL || defaultConnection),
  },
  production: {
    ...baseConfig,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // 🔑 required for Heroku Postgres
    },
    pool: { min: 2, max: 10 },
  },
};
