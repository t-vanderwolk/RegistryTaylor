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
import announcementsRoutes from './routes/announcements.js';
import commentsRoutes from './routes/comments.js';
import pinterestRoutes from './routes/pinterest.js';
import pollsRoutes from './routes/polls.js';
import messagesRoutes from './routes/messages.js';
import cookieParser from './middleware/cookieParser.js';

const app = express();

const allowedOrigins =
  config.env === 'development'
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : config.clientOrigins.length
    ? config.clientOrigins
    : [config.clientUrl];

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
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
app.use('/api/announcements', announcementsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/pinterest', pinterestRoutes);

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
