import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./utils/loadEnv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../.env");
loadEnv(rootEnvPath);

const rawClientOrigins =
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "https://taylormadebaby.co";

const clientOrigins = rawClientOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "5050", 10),
  jwtSecret: process.env.JWT_SECRET || "tmbc_secret_key",
  clientUrl: clientOrigins[0] || "https://taylormadebaby.co",
  clientOrigins,
};

export default config;
