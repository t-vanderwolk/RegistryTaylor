import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import config from './config.js';
import prisma from './db/prismaClient.js';
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import academyRoutes from './routes/academy.js';
import registryRoutes from './routes/registry.js';
import communityRoutes from './routes/community.js';
import blogRoutes from './routes/blog.js';
import eventsRoutes from './routes/events.js';
import cookieParser from './middleware/cookieParser.js';

const app = express();

const allowedOrigin =
  config.env === 'development' ? 'http://localhost:3000' : config.clientUrl;

app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/registry', registryRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/events', eventsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Unexpected server error.' });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Taylor-Made Baby Co. backend ready on port ${config.port}`);
});

const gracefulShutdown = async (signal) => {
  console.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) =>
  process.on(signal, () => gracefulShutdown(signal)),
);

export default app;
