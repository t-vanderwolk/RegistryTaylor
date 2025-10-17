import knex, { Knex } from "knex";
import config from "../../../db/knexfile";

const env = process.env.NODE_ENV ?? "development";
const knexConfig = config[env];

if (!knexConfig) {
  throw new Error(`No knex configuration found for environment "${env}"`);
}

export const db: Knex = knex(knexConfig);
