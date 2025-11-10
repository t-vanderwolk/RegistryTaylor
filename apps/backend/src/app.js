import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import config from './config.js';
import { healthCheck } from './controllers/healthController.js';
import cookieParser from './middleware/cookieParser.js';
import academyRoutes from './routes/academy.js';
import announcementsRoutes from './routes/announcements.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import commentsRoutes from './routes/comments.js';
import communityRoutes from './routes/community.js';
import eventsRoutes from './routes/events.js';
import messagesRoutes from './routes/messages.js';
import pinterestRoutes from './routes/pinterest.js';
import pollsRoutes from './routes/polls.js';
import profilesRoutes from './routes/profiles.js';
import registryRoutes from './routes/registry.js';
import workbookRoutes from './routes/workbook.js';
import { logError, logWarn } from './utils/logger.js';

const app = express();

const cspDirectives = {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
};

if (config.env !== 'production') {
  const scriptSrc = cspDirectives['script-src'] ?? ["'self'"];
  cspDirectives['script-src'] = [...scriptSrc, "'unsafe-eval'"];
}

const allowedOrigins = new Set([
  'http://localhost:3000',
  'https://taylor-made-baby-co.vercel.app',
  'https://www.taylormadebabyco.com',
  'https://taylormadebabyco.com',
  'https://taylor-made-7f1024d95529.herokuapp.com',
  'https://taylor-made-api-5289731b5afb.herokuapp.com',
  ...config.clientOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      logWarn(`❌ Blocked CORS request from ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: cspDirectives,
    },
  }),
);

app.get('/health', healthCheck);

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/pinterest', pinterestRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/registry', registryRoutes);
app.use('/api/workbook', workbookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

 
app.use((err, _req, res, _next) => {
  logError('API error', err);
  res.status(err.status || 500).json({ message: err.message || 'Unexpected server error.' });
});

export default app;
