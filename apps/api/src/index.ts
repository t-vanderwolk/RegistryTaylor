import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { inviteRouter } from "./routes/invite";
import { authRouter } from "./routes/auth";
import { affiliateRouter } from "./routes/affiliate";
import { registryRouter } from "./routes/registry";
import { academyRouter } from "./routes/academy";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : undefined,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/invite", inviteRouter);
app.use("/api/auth", authRouter);
app.use("/api/affiliate", affiliateRouter);
app.use("/api/registry", registryRouter);
app.use("/api", academyRouter);

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
