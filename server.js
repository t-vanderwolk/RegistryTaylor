const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const dotenv = require("dotenv");
const express = require("express");
const http = require("node:http");
const next = require("next");

const resolveFromRoot = (...segments) => path.join(__dirname, ...segments);

const loadEnvFile = (filename, override = false) => {
  const envPath = resolveFromRoot(filename);
  if (!fs.existsSync(envPath)) {
    return false;
  }
  dotenv.config({ path: envPath, override });
  return true;
};

const loadedBaseEnv = loadEnvFile(".env");
const loadedLocalEnv = loadEnvFile(".env.local", true);

if (!loadedBaseEnv && !loadedLocalEnv) {
  dotenv.config();
}

if (!process.env.TAILWIND_CONFIG) {
  process.env.TAILWIND_CONFIG = resolveFromRoot("apps/dashboard/tailwind.config.js");
}

if (!process.env.POSTCSS_CONFIG) {
  process.env.POSTCSS_CONFIG = resolveFromRoot("apps/dashboard/postcss.config.js");
}

const NEXT_APP_DIR = resolveFromRoot("apps/dashboard");
const NEXT_API_ROOT = path.join(NEXT_APP_DIR, "src/app/api");

const ROUTE_FILE_PATTERN = /^route\.(t|j)sx?$/i;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRouteRegex(routePath) {
  const normalized = routePath.startsWith("/") ? routePath : `/${routePath}`;
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return /^\/$/;
  }

  let pattern = "^";
  for (const segment of segments) {
    if (/^\[\[\.\.\.(.+)\]\]$/.test(segment)) {
      // Optional catch-all
      pattern += "(?:/.*)?";
      continue;
    }

    if (/^\[\.\.\.(.+)\]$/.test(segment)) {
      // Catch-all
      pattern += "/.+";
      continue;
    }

    if (/^\[(.+)\]$/.test(segment)) {
      // Dynamic
      pattern += "/[^/]+";
      continue;
    }

    pattern += `/${escapeRegex(segment)}`;
  }

  pattern += "/?$";
  return new RegExp(pattern);
}

function discoverNextApiRoutes(rootDir) {
  const discovered = new Set();

  function walk(currentRelativePath) {
    const directory = path.join(rootDir, currentRelativePath);
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const nextRelativePath = currentRelativePath ? path.join(currentRelativePath, entry.name) : entry.name;
      if (entry.isDirectory()) {
        walk(nextRelativePath);
        continue;
      }

      if (entry.isFile() && ROUTE_FILE_PATTERN.test(entry.name)) {
        const segments = currentRelativePath.split(path.sep).filter(Boolean);
        if (segments.length === 0) {
          continue;
        }
        const routePath = `/api/${segments.join("/")}`;
        discovered.add(routePath);
      }
    }
  }

  walk("");
  return Array.from(discovered);
}

const FALLBACK_NEXT_APIS = ["/api/session", "/api/member-dashboard"];
const NEXT_API_HANDLED_PATHS = (() => {
  const discovered = discoverNextApiRoutes(NEXT_API_ROOT);
  const combined = new Set([...discovered, ...FALLBACK_NEXT_APIS]);
  return Array.from(combined);
})();

const NEXT_API_ROUTE_MATCHERS = NEXT_API_HANDLED_PATHS.map((routePath) => ({
  routePath,
  matcher: buildRouteRegex(routePath),
}));

const FORCED_NEXT_PREFIXES = [
  "/api/member-dashboard",
  "/api/academy",
  "/api/registry",
  "/api/registry-items",
  "/api/registryNotes",
  "/api/catalog-items",
];

const isNextHandledApi = (urlPath = "") => {
  if (!urlPath) {
    return false;
  }
  if (FORCED_NEXT_PREFIXES.some((prefix) => urlPath === prefix || urlPath.startsWith(`${prefix}/`))) {
    return true;
  }
  return NEXT_API_ROUTE_MATCHERS.some(({ matcher }) => matcher.test(urlPath));
};

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
  const buildDir = resolveFromRoot("apps/dashboard/.next");
  if (process.env.NODE_ENV === "production" && !fs.existsSync(buildDir)) {
    console.error("⚠️ No Next build found. Run `pnpm build` before starting production mode.");
    process.exit(1);
  }

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
      req.headers.cookie = req.headers.cookie || "";
      req.headers.authorization = req.headers.authorization || "";
      return backendApp(req, res, nextFn);
    }
    return nextFn();
  });

  server.all("*", (req, res) => handle(req, res));

  const port = Number.parseInt(process.env.PORT || "5050", 10);
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
