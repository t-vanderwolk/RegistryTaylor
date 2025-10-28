const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const totsquadEmbedOrigin = 'https://babyconcierge.totsquad.com';
const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

const invitesRouter = require('./routes/invites');
const blogRouter = require('./routes/blog');
const apiV1 = require('./routes/v1');
const api = require('./routes/api');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...defaultDirectives,
        'script-src': [
          ...(defaultDirectives['script-src'] || []),
          totsquadEmbedOrigin,
        ],
        'frame-src': [
          ...(defaultDirectives['frame-src'] || ["'self'"]),
          totsquadEmbedOrigin,
        ],
        'connect-src': [
          ...(defaultDirectives['connect-src'] || ["'self'"]),
          totsquadEmbedOrigin,
        ],
      },
    },
  })
);
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/invites', invitesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/v1', apiV1);
app.use('/api', api);

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

app.use(notFound);
app.use(errorHandler);

module.exports = app;
