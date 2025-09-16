const levels = ['error', 'warn', 'info', 'debug'];

const shouldLog = (level) => {
  const envLevel = process.env.LOG_LEVEL || 'info';
  return levels.indexOf(level) <= levels.indexOf(envLevel);
};

const log = (level, message, meta = {}) => {
  if (!shouldLog(level)) return;
  const timestamp = new Date().toISOString();
  const payload = { level, message, timestamp, ...meta };
  if (level === 'error') {
    console.error(payload);
  } else if (level === 'warn') {
    console.warn(payload);
  } else {
    console.log(payload);
  }
};

module.exports = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};
