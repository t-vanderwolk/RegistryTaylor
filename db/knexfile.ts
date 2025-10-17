import path from "path";
import { config as loadEnv } from "dotenv";
import { Knex } from "knex";

loadEnv({ path: path.resolve(process.cwd(), ".env") });

const {
  DATABASE_URL,
  PGHOST = "localhost",
  PGPORT = "5432",
  PGDATABASE = "registry_taylor",
  PGUSER = "postgres",
  PGPASSWORD = "postgres",
} = process.env;

const connection =
  DATABASE_URL ??
  {
    host: PGHOST,
    port: Number(PGPORT),
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
  };

const shared: Knex.Config = {
  client: "pg",
  connection,
  migrations: {
    directory: path.resolve(process.cwd(), "migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.resolve(process.cwd(), "seeds"),
    extension: "ts",
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const config: Record<string, Knex.Config> = {
  development: shared,
  production: shared,
  test: {
    ...shared,
    connection:
      typeof connection === "string"
        ? connection
        : {
            ...connection,
            database:
              typeof connection === "string"
                ? connection
                : `${connection.database ?? "registry_taylor"}_test`,
          },
  },
};

export default config;
