const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiV1 = require('./routes/v1');
const api = require('./routes/api');

const app = express();

const totsquadEmbedOrigin = 'https://babyconcierge.totsquad.com';
const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();

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
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', apiV1);
app.use('/api', api);

module.exports = app;
