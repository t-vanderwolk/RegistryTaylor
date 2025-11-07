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

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'https://www.taylormadebabyco.com',
  'https://taylormadebabyco.com',
  'https://taylor-made-7f1024d95529.herokuapp.com',
];

const envAllowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((url) => url.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...envAllowedOrigins, ...defaultAllowedOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
