const isTest = process.env.NODE_ENV === 'test';

const log = (level, message, ...args) => {
  if (isTest) return;
  const prefix = level.toUpperCase().padEnd(5, ' ');
  console.log(`[${prefix}] ${message}`, ...args);  
};

export const logInfo = (message, ...args) => log('info', message, ...args);
export const logWarn = (message, ...args) => log('warn', message, ...args);
export const logError = (message, ...args) => log('error', message, ...args);

export default {
  logInfo,
  logWarn,
  logError,
};
