const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const dotenv = require("dotenv");
const express = require("express");
const http = require("node:http");
const next = require("next");

const resolveFromRoot = (...segments) => path.join(__dirname, ...segments);

const rootEnvPath = resolveFromRoot(".env");
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

if (!process.env.TAILWIND_CONFIG) {
  process.env.TAILWIND_CONFIG = resolveFromRoot("apps/dashboard/tailwind.config.js");
}

if (!process.env.POSTCSS_CONFIG) {
  process.env.POSTCSS_CONFIG = resolveFromRoot("apps/dashboard/postcss.config.js");
}

const NEXT_API_HANDLED_PATHS = ["/api/session"];

const isNextHandledApi = (urlPath = "") =>
  NEXT_API_HANDLED_PATHS.some((path) => urlPath === path || urlPath.startsWith(`${path}/`));

const shouldPipeToBackend = (urlPath = "") => {
  if (isNextHandledApi(urlPath)) {
    return false;
  }

  if (
    urlPath === "/health" ||
    urlPath === "/cors-check" ||
    urlPath === "/api" ||
    urlPath === "/api/health"
  ) {
    return true;
  }

  return urlPath.startsWith("/api/");
};

let httpServer;

async function bootstrap() {
  console.log("🚧 Bootstrapping Taylor-Made unified server…");
  const backendModulePath = resolveFromRoot("apps/backend/src/app.js");
  const backendApp = (await import(pathToFileURL(backendModulePath).href)).default;
  console.log("✅ Express API loaded");

  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({
    dev,
    dir: resolveFromRoot("apps/dashboard"),
  });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();
  console.log("✅ Next.js build prepared");

  const server = express();
  server.set("trust proxy", 1);

  server.use((req, res, nextFn) => {
    if (shouldPipeToBackend(req.path)) {
      return backendApp(req, res, nextFn);
    }
    return nextFn();
  });

  server.all("*", (req, res) => handle(req, res));

  const port = Number.parseInt(process.env.PORT || "3000", 10);
  httpServer = http.createServer(server);
  httpServer.on("error", (error) => {
    console.error("❌ Failed to start unified server", error);
    process.exit(1);
  });
  httpServer.listen(port, () =>
    console.log(`🚀 Taylor-Made unified app ready on http://localhost:${port}`)
  );
}

const gracefulShutdown = (signal) => {
  if (!httpServer) {
    process.exit(0);
  }

  console.log(`Received ${signal}. Closing unified server...`);
  httpServer.close(() => {
    console.log("Server closed. Goodbye 👋");
    process.exit(0);
  });
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

bootstrap().catch((error) => {
  console.error("Failed to bootstrap Taylor-Made server", error);
  process.exit(1);
});
