const knexConfig = require('../../knexfile');
const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

if (!config || !config.connection) {
  throw new Error(`Knex configuration missing for environment: ${environment}`);
}

const db = knex(config);

module.exports = db;
