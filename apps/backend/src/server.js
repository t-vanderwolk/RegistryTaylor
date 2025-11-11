// server.js — unified, safe bootstrap for Taylor-Made Baby Co.

import express from "express";
import next from "next";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5050;
const dev = process.env.NODE_ENV !== "production";
const nextDir = path.resolve("apps/dashboard");
const app = next({ dev, dir: nextDir });
const handle = app.getRequestHandler();

async function bootstrap() {
  try {
    console.log("🚧 Bootstrapping Taylor-Made unified server…");

    const server = express();
    console.log("✅ Express API loaded");

    // ---  Safe CORS config  ---
    const raw = process.env.ALLOWED_ORIGINS || "";
    const origins = raw.split(",").map(o => o.trim()).filter(Boolean);
    console.log("🧩 Allowed origins:", origins.length ? origins : "(none set)");

    server.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
      }
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      next();
    });

    // ---  Health check  ---
    server.get("/api/health", (_, res) =>
      res.json({
        status: "ok",
        message: "Unified Taylor-Made server running",
      })
    );

    // ---  Serve Next.js frontend  ---
    await app.prepare();
    server.all("*", (req, res) => handle(req, res));

    server.listen(port, () =>
      console.log(`🚀 Unified server ready → http://localhost:${port}`)
    );
  } catch (err) {
    console.error("💥 Failed to bootstrap Taylor-Made server");
    console.error(err);
    process.exit(1);
  }
}

bootstrap();