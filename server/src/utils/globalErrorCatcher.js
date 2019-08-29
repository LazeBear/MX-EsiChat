const logger = require('./logger');
process.on('uncaughtException', e => {
  logger.error(e.stack);
  logger.error(e.message);
  // setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', e => {
  logger.error(e.stack);
  logger.error(e.message);
  // setTimeout(() => process.exit(1), 1000);
});
